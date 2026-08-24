
const mockFindUser = jest.fn();
const mockCheckPassword = jest.fn();
const mockjwtsign = jest.fn()

const mockPrisma = {
    user:{
        findUnique:mockFindUser
    }
}

const mockBcrypt ={
    compare:mockCheckPassword
}

const mockJwt ={
    sign:mockjwtsign
}

jest.mock("../prisma/prisma",()=>{
    return mockPrisma   
})

jest.mock("bcrypt",()=>{
    return(mockBcrypt)
})

jest.mock("jsonwebtoken",()=>{
    return mockJwt
})

process.env.JWT_SECRET = "test_secret";

const loginController = require("../controllers/loginController");

let res;
let req;
let mockUser;

beforeEach(()=>{
    jest.clearAllMocks();

    res={
        status:jest.fn().mockReturnThis(),
        json:jest.fn()
    }

    req={
        body:{
            email:'test@gmail.com',
            password:"1234"
        }
    }

    mockUser={
        id:1,
        email:"test@gmail.com",
        password:"hashed-password",
        name:"admin",
        role:"admin"
    }
})

describe("Login validation",()=>{
    test("should return 422 when email and password are empty",async()=>{
    req.body.email="";
    req.body.password=""

    await loginController(req,res);
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({"error": "Please fill all the details."});


})

    test("should return 422 when email is provided but password is empty",async()=>{

    req.body.password="";

    await loginController(req,res);
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({"error":"Please fill all the details."})
})

    test("should return 422 when password is provided but email is empty",async()=>{
    req.body.email="";


    await loginController(req,res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({"error":"Please fill all the details."})
})
})

describe("Login Authentication",()=>{
    test("Should return 404 when user is not found",async()=>{

    mockFindUser.mockResolvedValue(null)

    await loginController(req,res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({"error":"User Not Found"});
    expect(mockFindUser).toHaveBeenCalledWith({
        where:{
            email:"test@gmail.com"
        }
    });

    expect(mockFindUser).toHaveBeenCalledTimes(1);
    expect(mockCheckPassword).not.toHaveBeenCalled();
    expect(mockjwtsign).not.toHaveBeenCalled();



    })


    test("should return 401 when Password does not match",async()=>{

    mockFindUser.mockResolvedValue(mockUser)
    mockCheckPassword.mockResolvedValue(false);

    await loginController(req,res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({"error":"invalid Credentials"});
    expect(mockCheckPassword).toHaveBeenCalledWith("1234",mockUser.password);

    expect(mockFindUser).toHaveBeenCalledTimes(1);
    expect(mockCheckPassword).toHaveBeenCalledTimes(1);
    expect(mockjwtsign).not.toHaveBeenCalled();


    })
})


describe("Successful login",()=>{
    test("should generate token and return successful login response",async()=>{


    mockFindUser.mockResolvedValue(mockUser)

    mockCheckPassword.mockResolvedValue(true);

    mockjwtsign.mockReturnValue("fake-token");

    await loginController(req,res);

    expect(mockFindUser).toHaveBeenCalledWith({
        where:{
            email:"test@gmail.com"
        }
    })

    expect(mockCheckPassword).toHaveBeenCalledWith("1234",mockUser.password)

    expect(mockjwtsign).toHaveBeenCalledWith(
         {"email": "test@gmail.com", "id": 1, "name": "admin", "role": "admin"}, "test_secret", {"expiresIn": "1h"}
    )

    expect(res.json).toHaveBeenCalledWith(
        {"email": "test@gmail.com", "message": "Login successful", "name": "admin", "role": "admin", "token": "fake-token"}
    )

    expect(mockFindUser).toHaveBeenCalledTimes(1);
    expect(mockCheckPassword).toHaveBeenCalledTimes(1);
    expect(mockjwtsign).toHaveBeenCalledTimes(1);
    })
})



describe("Error handling",()=>{
test("should return 500 when finding user fails",async()=>{


    mockFindUser.mockRejectedValue(new Error());

    await loginController(req,res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({"error":"Error,please try again later"})
    
   
})


test("should return 500 when password comparison fails",async()=>{

    mockFindUser.mockResolvedValue(mockUser)

    mockCheckPassword.mockRejectedValue(new Error());

    await loginController(req,res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({"error":"Error,please try again later"});


})

test("should return 500 when JWT generation fails",async()=>{

    mockFindUser.mockResolvedValue(mockUser)

    mockCheckPassword.mockResolvedValue(true)

    mockjwtsign.mockImplementation(()=>{
        throw new Error()
    })

    await loginController(req,res)
     expect(res.status).toHaveBeenCalledWith(500);
     expect(res.json).toHaveBeenCalledWith({"error":"Error,please try again later"});

})
})




