const mockFindUser = jest.fn();
const mockUpdate = jest.fn();
const mockDeleteMany = jest.fn();
const mockCreate = jest.fn();
const mockPost = jest.fn();
const mockCheckOTP = jest.fn();
const mockTransaction = jest.fn();
const mockHash = jest.fn();
const mockOtpUpdate = jest.fn()


const mockPrisma = {
    user:{
        findUnique:mockFindUser,
        update:mockUpdate
    },
    passwordReset:{
        deleteMany:mockDeleteMany,
        create:mockCreate,
        findFirst:mockCheckOTP,
        update:mockOtpUpdate
    },
    $transaction:mockTransaction
}
const mockAxios ={
    post:mockPost
}

const mockBcrypt = {
    hash:mockHash
}
jest.mock('../prisma/prisma',()=>{
    return mockPrisma
})

jest.mock("axios",()=>{
    return mockAxios
})

jest.mock("bcrypt",()=>{
    return mockBcrypt
})

  process.env.BASEURL='http://sample.company.in';
  process.env.EMAIL="admin@gmail.com"
  process.env.TOKEN="123drwedew"

const {forgotPassword,verifyOTP,resetPassword,resendOTP} = require("../controllers/forgotPasswordController");
    


let req,res;
const mockUser={
        id:1,
        email:"test@gmail.com",
        password:"hashed-password",
        role:"admin",
        name:"admin"
}


describe("forgotPassword Controller",()=>{
    beforeEach(()=>{
    jest.clearAllMocks();
    req={
        body:{
            email:"test@gmail.com"
        }

    }

    res={
        status:jest.fn().mockReturnThis(),
        json:jest.fn(),
        send:jest.fn()
    }
})
test("should return 404 when user not found",async()=>{
    mockFindUser.mockResolvedValue(null);
    await forgotPassword(req,res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({"error":"User not found"});

expect(mockDeleteMany).not.toHaveBeenCalled();
expect(mockCreate).not.toHaveBeenCalled();
expect(mockPost).not.toHaveBeenCalled();
    
})

test("should delete existing OTP record",async()=>{
    mockFindUser.mockResolvedValue(mockUser)
    mockDeleteMany.mockResolvedValue({})


    await forgotPassword(req,res);
    expect(mockDeleteMany).toHaveBeenCalledWith({where:{email:"test@gmail.com"}});
   
})

test("should create new OTP record and send email",async()=>{
    mockFindUser.mockResolvedValue(mockUser)

    mockDeleteMany.mockResolvedValue({});
    mockCreate.mockResolvedValue({});

    mockPost.mockResolvedValue({
        data:{
            message:"Email queued successfully"
        }
    })


    await forgotPassword(req,res);

        expect(mockCreate).toHaveBeenCalledWith({
        data:{
            email:"test@gmail.com",
            otp:expect.any(String),
            expiresAt:expect.any(Date),
            resendAvailableAt:expect.any(Date)
        }
    })

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.send).toHaveBeenCalledWith({"message": "Email queued successfully"})

    expect(mockPost).toHaveBeenCalledWith(
       "http://sample.company.in/api/emails", 
       {"message":expect.stringContaining("This is a OTP for Reset Password"), 
        "title": "Password Reset OTP",
         "to": "test@gmail.com"
        }, 
         {"headers": 
            {"Content-Type": "application/json", 
            "X-Email": "admin@gmail.com", 
            "X-Token": "123drwedew"
        }}

    )
})


test("should return 500 when email sending fails",async()=>{
    mockFindUser.mockResolvedValue(mockUser)

    mockDeleteMany.mockResolvedValue()
    mockCreate.mockResolvedValue()

    mockPost.mockRejectedValue(new Error("Email API failed"))

    await forgotPassword(req,res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({"error":"Failed to send OTP email"})
})
})


describe("verify otp controller",()=>{

    beforeEach(()=>{
    jest.clearAllMocks();
    req={
        body:{
            email:"test@gmail.com",
            otp:"123456"
        }

    }

    res={
        status:jest.fn().mockReturnThis(),
        json:jest.fn(),
    }
})
    test("should return 404 when otp is invalid",async()=>{
        mockCheckOTP.mockResolvedValue(null);

        await verifyOTP(req,res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error:"Invalid OTP"})
    })

    test("should return 400 when OTP was expired",async()=>{

        mockCheckOTP.mockResolvedValue({
            email:"test@gmail.com",
            otp:"123456",
            expiresAt:new Date(Date.now()-60000),
            resendAvailableAt:new Date(Date.now()-60000)

        })
        await verifyOTP(req,res)
        expect(mockCheckOTP).toHaveBeenCalledWith({
            where:{
                email:"test@gmail.com",
                otp:"123456"
            }
        })
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({error:"OTP Expired"})
    })

    test("should return 200 when successfully otp verifed",async()=>{
        mockCheckOTP.mockResolvedValue({
            email:"test@gmail.com",
            otp:"123456",
            expiresAt:new Date(Date.now()+60000),
            resendAvailableAt:new Date(Date.now()+60000)
        })

        await verifyOTP(req,res);

        expect(mockCheckOTP).toHaveBeenCalledWith({
            where:{
                email:"test@gmail.com",
                otp:"123456"
            }
        })

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message:"OTP verified"})
    })

    test("should return 500 when sommething failed",async()=>{
        mockCheckOTP.mockRejectedValue(new Error("Something wrong"))

        await verifyOTP(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later."})
    })
})

describe("ResetPassword Controller",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
        req={
            body:{
                email:"test@gmail.com",
                password:"pass@1234"
            }
        }

        res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        }
    })

    test("should return 400 when email and password are empty",async()=>{
        req.body.email="";
        req.body.password="";

        await resetPassword(req,res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Email and password are required"});
        expect(mockFindUser).not.toHaveBeenCalled();
    })

    test("should return 400 when email is provided but password is empty",async()=>{
        req.body.password="";

        await resetPassword(req,res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Email and password are required"});
        expect(mockFindUser).not.toHaveBeenCalled()
    })

    test("should return 400 when password is provided but email is empty",async()=>{
        req.body.email="";

        await resetPassword(req,res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Email and password are required"});
        expect(mockFindUser).not.toHaveBeenCalled()
    })

    test("should return 404 when user not found",async()=>{
        mockFindUser.mockResolvedValue(null);

        await resetPassword(req,res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error:"User not found."})
    })

    test("should update password successfully",async()=>{
        mockFindUser.mockResolvedValue(mockUser)

        mockHash.mockResolvedValue("new-hashed-password");

        mockUpdate.mockResolvedValue({});
        mockDeleteMany.mockResolvedValue({});


        mockTransaction.mockImplementation(async (callback)=>{
            return callback({
                user:{
                    update:mockUpdate
                },
                passwordReset:{
                    deleteMany:mockDeleteMany
                }
            })
        })

        await resetPassword(req,res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message:"Password updated successfully"})

        expect(mockHash).toHaveBeenCalledWith("pass@1234",10);

        expect(mockUpdate).toHaveBeenCalledWith({
            where:{
                email:"test@gmail.com"
            },data:{
                password:"new-hashed-password"
            }
        })

        expect(mockDeleteMany).toHaveBeenCalledWith({
            where:{
                email:"test@gmail.com"
            }
        })
    })

    test("should return 500 when finding user fails",async()=>{
        mockFindUser.mockRejectedValue(new Error("find user returns an error"))

        await resetPassword(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockHash).not.toHaveBeenCalled();
        expect(mockTransaction).not.toHaveBeenCalled();
    })

    test("should return 500 when password hashing fails",async()=>{
        mockFindUser.mockResolvedValue(mockUser);

        mockHash.mockRejectedValue(new Error("hashing failed"));

        await resetPassword(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockHash).toHaveBeenCalledWith("pass@1234",10);
        expect(mockTransaction).not.toHaveBeenCalled();
    })

    test("should return 500 when transcation fails",async()=>{
        mockFindUser.mockResolvedValue(mockUser);
        mockHash.mockResolvedValue("new-hashed-password");

        mockTransaction.mockRejectedValue(new Error("Transaction failed"));

        await resetPassword(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockHash).toHaveBeenCalledWith("pass@1234", 10);

        expect(mockTransaction).toHaveBeenCalled(); 

    })
})

describe("ResendOtp controller",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
        req={
            body:{
                email:"test@gmail.com"
            }
        }
        res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        }
    })

    test("should return 404 when user not found",async()=>{
        mockFindUser.mockResolvedValue(null);

        await resendOTP(req,res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error:"User not found"});

        expect(mockCheckOTP).not.toHaveBeenCalled();
        expect(mockOtpUpdate).not.toHaveBeenCalled();
        expect(mockPost).not.toHaveBeenCalled();

    })

    test("should return 404 when password reset not found",async()=>{
        mockFindUser.mockResolvedValue(mockUser)
        mockCheckOTP.mockResolvedValue(null);

        await resendOTP(req,res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error:"Not found"});

        expect(mockOtpUpdate).not.toHaveBeenCalled();
        expect(mockPost).not.toHaveBeenCalled();


    })

        test("should return 400 when OTP resend available",async()=>{
            mockFindUser.mockResolvedValue(mockUser)
        mockCheckOTP.mockResolvedValue({
            email:"test@gmail.com",
            otp:"123456",
            expiresAt:new Date(Date.now()+60000),
            resendAvailableAt:new Date(Date.now()+60000)

        })
        await resendOTP(req,res)
 
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({error:"Please wait until OTP expires"})

        expect(mockOtpUpdate).not.toHaveBeenCalled();
        expect(mockPost).not.toHaveBeenCalled();
    })


    test("should resend OTP successfully when OTP is expired",async()=>{
        mockFindUser.mockResolvedValue(mockUser);

        mockCheckOTP.mockResolvedValue({
        id: 1,
        email: "test@gmail.com",
        otp: "123456",
        expiresAt: new Date(Date.now() - 60000),
        resendAvailableAt: new Date(Date.now() - 60000)
    });

    mockOtpUpdate.mockResolvedValue({});
    mockPost.mockResolvedValue({
        data:{
            message:"OTP resent successfully"
        }
    })

    await resendOTP(req,res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({message:"OTP resent successfully"})

    expect(mockPost).toHaveBeenCalledWith(
        "http://sample.company.in/api/emails",
        {
            title: "OTP resent successfully",
            message: expect.stringContaining("The new OTP is"),
            to: "test@gmail.com"
        },
        {
            headers: {
                "X-Email": "admin@gmail.com",
                "X-Token": "123drwedew",
                "Content-Type": "application/json"
            }
        }
    );

    expect(mockOtpUpdate).toHaveBeenCalledWith({
        where: {
            id: 1
        },
        data: {
            otp: expect.any(String),
            expiresAt: expect.any(Date),
            resendAvailableAt: expect.any(Date)
        }
    })
})

test("should return 500 when finding user fails",async()=>{
    mockFindUser.mockRejectedValue(new Error("Database Error"));

    await resendOTP(req,res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({error:"Failed to send OTP"});


    expect(mockCheckOTP).not.toHaveBeenCalled();
    expect(mockOtpUpdate).not.toHaveBeenCalled();
    expect(mockPost).not.toHaveBeenCalled();
})

test("should return 500 when finding OTP fails",async()=>{
    mockFindUser.mockResolvedValue(mockUser);
    mockCheckOTP.mockRejectedValue(new Error("Failed to find OTP"));

    await resendOTP(req,res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({error:"Failed to send OTP"});

    expect(mockOtpUpdate).not.toHaveBeenCalled();
    expect(mockPost).not.toHaveBeenCalled();
})


test("should return 500 when updating OTP fails",async()=>{
    mockFindUser.mockResolvedValue(mockUser);

    mockCheckOTP.mockResolvedValue({
        id: 1,
        email: "test@gmail.com",
        otp: "123456",
        expiresAt: new Date(Date.now() - 60000),
        resendAvailableAt: new Date(Date.now() - 60000)
    })

    mockOtpUpdate.mockRejectedValue(new Error("Failes to update OTP"));

    await resendOTP(req,res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({error:"Failed to send OTP"})

    expect(mockPost).not.toHaveBeenCalled()
})

test("should return 500 when sending OTP email fails",async()=>{
    mockFindUser.mockResolvedValue(mockUser);
    mockCheckOTP.mockResolvedValue({
        id: 1,
        email: "test@gmail.com",
        otp: "123456",
        expiresAt: new Date(Date.now() - 60000),
        resendAvailableAt: new Date(Date.now() - 60000)
    })

    mockOtpUpdate.mockResolvedValue({});

    mockPost.mockRejectedValue(new Error("Email API failed"));

    await resendOTP(req,res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({error:"Failed to send OTP"});

    expect(mockOtpUpdate).toHaveBeenCalled();

    expect(mockPost).toHaveBeenCalled();

})
})