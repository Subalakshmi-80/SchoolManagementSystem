const mockHash = jest.fn();
const mockTransaction = jest.fn()
const mockUserFindUnique = jest.fn();
const mockUserCreate = jest.fn();
const mockStudentCreate = jest.fn();
const mockStudentFindMany = jest.fn(); 
const mockStudentFindUnique = jest.fn();
const mockUserUpdate = jest.fn();
const mockStudentUpdate = jest.fn();
const mockStudentDelete = jest.fn();
const mockUserDelete = jest.fn();

const mockPrisma = {
    user:{
        findUnique:mockUserFindUnique,
        create:mockUserCreate,
        update:mockUserUpdate,
        delete:mockUserDelete
    },
    student:{
        create:mockStudentCreate,
        findMany:mockStudentFindMany,
        findUnique:mockStudentFindUnique,
        update:mockStudentUpdate,
        delete:mockStudentDelete
    },

    $transaction:mockTransaction
}

const mockBcrypt ={
    hash:mockHash
}

jest.mock("../prisma/prisma",()=>{
    return mockPrisma
})

jest.mock("bcrypt",()=>{
    return mockBcrypt
})

const {createStudent, getStudents, getOneStd, updateStd, deleteStd} = require("../controllers/studentController");


let req,res;

describe("create student controller",()=>{
    
    beforeEach(() => {
    jest.clearAllMocks();

    req = {
        body: {
            name: "Arun Kumar",
            email: "arun@gmail.com",
            password: "arun@123",
            regno: "REG1001",
            first_name: "Arun",
            last_name: "Kumar",
            gender: "Male",
            dob: "2000-01-01",
            phone: "9876543210",
            class_id: 1,
            address_line1: "Address 1",
            address_line2: "Address 2",
            city: "Chennai",
            state: "Tamil Nadu"
        }
    };

    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
});

  test("should return 400 when required fields are empty",async()=>{
        req.body.email="";
        req.body.name="";
        req.body.password="";
        req.body.regno="";
        req.body.class_id="";

        await createStudent(req,res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({error:"Please provide mandatory fields"});

        expect(mockUserFindUnique).not.toHaveBeenCalled();
        expect(mockHash).not.toHaveBeenCalled();
        expect(mockUserCreate).not.toHaveBeenCalled();
        expect(mockStudentCreate).not.toHaveBeenCalled();
        expect(mockTransaction).not.toHaveBeenCalled();

    })

    test("should return 400 when email is empty",async()=>{
        req.body.email="";

        await createStudent(req,res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({error:"Please provide mandatory fields"});

        expect(mockUserFindUnique).not.toHaveBeenCalled();
        expect(mockHash).not.toHaveBeenCalled();
        expect(mockUserCreate).not.toHaveBeenCalled();
        expect(mockStudentCreate).not.toHaveBeenCalled();
        expect(mockTransaction).not.toHaveBeenCalled();
    })

    test("should return 400 when name is empty",async()=>{
        req.body.name="";

        await createStudent(req,res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({error:"Please provide mandatory fields"});

        expect(mockUserFindUnique).not.toHaveBeenCalled();
        expect(mockHash).not.toHaveBeenCalled();
        expect(mockUserCreate).not.toHaveBeenCalled();
        expect(mockStudentCreate).not.toHaveBeenCalled();
        expect(mockTransaction).not.toHaveBeenCalled();
    })

    test("should return 400 when password is empty",async()=>{
        req.body.password="";

        await createStudent(req,res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({error:"Please provide mandatory fields"});

        expect(mockUserFindUnique).not.toHaveBeenCalled();
        expect(mockHash).not.toHaveBeenCalled();
        expect(mockUserCreate).not.toHaveBeenCalled();
        expect(mockStudentCreate).not.toHaveBeenCalled();
        expect(mockTransaction).not.toHaveBeenCalled();
    })

    test("should return 400 when register number is empty",async()=>{
        req.body.regno="";

        await createStudent(req,res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({error:"Please provide mandatory fields"});

        expect(mockUserFindUnique).not.toHaveBeenCalled();
        expect(mockHash).not.toHaveBeenCalled();
        expect(mockUserCreate).not.toHaveBeenCalled();
        expect(mockStudentCreate).not.toHaveBeenCalled();
        expect(mockTransaction).not.toHaveBeenCalled();
    })

    test("should return 400 when class Id is empty",async()=>{
        req.body.class_id="";

        await createStudent(req,res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({error:"Please provide mandatory fields"});

        expect(mockUserFindUnique).not.toHaveBeenCalled();
        expect(mockHash).not.toHaveBeenCalled();
        expect(mockUserCreate).not.toHaveBeenCalled();
        expect(mockStudentCreate).not.toHaveBeenCalled();
        expect(mockTransaction).not.toHaveBeenCalled();
    })

    test("should return 409 when email already exists",async()=>{
        mockUserFindUnique.mockResolvedValue(true);

        await createStudent(req,res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({error:"Email already exists"});

        expect(mockUserFindUnique).toHaveBeenCalledWith({
            where:{
                email:"arun@gmail.com"
            }
        })

        expect(mockHash).not.toHaveBeenCalled();
        expect(mockTransaction).not.toHaveBeenCalled();
        expect(mockUserCreate).not.toHaveBeenCalled();
        expect(mockStudentCreate).not.toHaveBeenCalled();
    })

    test("should return 201 when student created successfully",async()=>{
        mockUserFindUnique.mockResolvedValue(null);
        mockHash.mockResolvedValue("hashed-password");

        mockUserCreate.mockResolvedValue({
            id:1,
            name:"Arun Kumar",
            email:"arun@gmail.com",
            password:"hashed-password",
            role:"student"
        });
        mockStudentCreate.mockResolvedValue();

        mockTransaction.mockImplementation(async(callback)=>{
            return callback({
                user:{
                    create:mockUserCreate
                },
                student:{
                    create:mockStudentCreate
                }
            })
        })
        await createStudent(req,res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({message:"Student created successfully"});

        expect(mockUserFindUnique).toHaveBeenCalledWith({
            where:{
                email:"arun@gmail.com"
            }
        })

        expect(mockHash).toHaveBeenCalledWith("arun@123",10);

        expect(mockUserCreate).toHaveBeenCalledWith({
            data:{
                name:"Arun Kumar",
               email: "arun@gmail.com",
               password:"hashed-password",
               role:"student"
            }
        })

        expect(mockStudentCreate).toHaveBeenCalledWith({
            data:expect.objectContaining({
                regNo:"REG1001",
                firstName:"Arun"

            })
        })

        expect(mockTransaction).toHaveBeenCalled()
    })

    test("should return 500 when finding existing user fails",async()=>{
        mockUserFindUnique.mockRejectedValue(new Error("Finding Existing user fails"));

        await createStudent(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockUserFindUnique).toHaveBeenCalledWith({
            where:{
                email:"arun@gmail.com"
            }
        })

        expect(mockHash).not.toHaveBeenCalled();
        expect(mockTransaction).not.toHaveBeenCalled();
        expect(mockUserCreate).not.toHaveBeenCalled();
        expect(mockStudentCreate).not.toHaveBeenCalled();

    })

    test("should return 500 when password hashing fails",async()=>{
        mockUserFindUnique.mockResolvedValue(null);

        mockHash.mockRejectedValue(new Error("password hashing fails"));

        await createStudent(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockUserFindUnique).toHaveBeenCalledWith({
            where:{
                email:"arun@gmail.com"
            }
        })

        expect(mockHash).toHaveBeenCalledWith("arun@123",10);
        expect(mockTransaction).not.toHaveBeenCalled();
        expect(mockUserCreate).not.toHaveBeenCalled();
        expect(mockStudentCreate).not.toHaveBeenCalled();

    })

    test("should return 500 when user creation inside transaction fails",async()=>{
        mockUserFindUnique.mockResolvedValue(null);
        mockHash.mockResolvedValue("hashed-password");

        mockUserCreate.mockRejectedValue(new Error("User creation failed"));

        mockTransaction.mockImplementation(async(callback)=>{
        return callback({
            user:{
                create:mockUserCreate
            },
            student:{
                create:mockStudentCreate
            }
        })
    });
        await createStudent(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockUserFindUnique).toHaveBeenCalledWith({
            where:{
                email:"arun@gmail.com"
            }
        })

        expect(mockHash).toHaveBeenCalledWith("arun@123",10);
        expect(mockTransaction).toHaveBeenCalled();
        expect(mockUserCreate).toHaveBeenCalledWith({
            data:{
                name:"Arun Kumar",
                email: "arun@gmail.com",
                password:"hashed-password",
                role:"student"
            }
        });
        expect(mockStudentCreate).not.toHaveBeenCalled();


    })

    test("should return 500 when student creation inside transaction fails",async()=>{
        mockUserFindUnique.mockResolvedValue(null);
        mockHash.mockResolvedValue("hashed-password");

        mockUserCreate.mockResolvedValue({
            id:1,
            name:"Arun Kumar",
            email:"arun@gmail.com",
            password:"hashed-password",
            role:"student"
        })
        mockStudentCreate.mockRejectedValue(new Error("Student creation failed"));

        mockTransaction.mockImplementation(async(callback)=>{
        return callback({
            user:{
                create:mockUserCreate
            },
            student:{
                create:mockStudentCreate
            }
        })
    });
        await createStudent(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockUserFindUnique).toHaveBeenCalledWith({
            where:{
                email:"arun@gmail.com"
            }
        })

        expect(mockHash).toHaveBeenCalledWith("arun@123",10);
        expect(mockTransaction).toHaveBeenCalled();
        expect(mockUserCreate).toHaveBeenCalledWith({
            data:{
                name:"Arun Kumar",
                email: "arun@gmail.com",
                password:"hashed-password",
                role:"student"
            }
        });
        expect(mockStudentCreate).toHaveBeenCalledWith({
            data:expect.objectContaining({
                regNo:"REG1001",
                firstName:"Arun"
            })
        });


    })
})


describe("Get student controller",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();

        res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        }

    })

    test("should return 200 when fetching student data successfully",async()=>{
        mockStudentFindMany.mockResolvedValue([
            {
                id:1,
                userId:7,
                firstName: "Janani",
                lastName: "Ram",
                gender: "Female",
                classId:1,
                user:{
                id:7,
                name:"Janani Ram",
                email:"janani@gmail.com",
                role:"student"
                }

            },
                        {
                id:2,
                userId:8,
                firstName: "Arun",
                lastName: "Kumar",
                gender: "Male",
                classId:2,
                user:{
                id:8,
                name:"Arun Kumar",
                email:"arun@gmail.com",
                role:"student"
                }

            }
        ])

        await getStudents(req,res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            [
            {
                id:1,
                userId:7,
                firstName: "Janani",
                lastName: "Ram",
                gender: "Female",
                classId:1,
                user:{
                id:7,
                name:"Janani Ram",
                email:"janani@gmail.com",
                role:"student"
                }

            },
                        {
                id:2,
                userId:8,
                firstName: "Arun",
                lastName: "Kumar",
                gender: "Male",
                classId:2,
                user:{
                id:8,
                name:"Arun Kumar",
                email:"arun@gmail.com",
                role:"student"
                }

            }
        ]
        );

        expect(mockStudentFindMany).toHaveBeenCalledWith({
            include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        role:true
                    }
                },
                class:{
                    include:{
                        standard:true
                    }
                },
                
            },
            orderBy:{
                    classId:"asc"
            }
        
        })
    })

    test("should return 500 when fetching student data fails",async()=>{
        mockStudentFindMany.mockRejectedValue(new Error("Error fetching Student data"));

        await getStudents(req,res);

        expect(mockStudentFindMany).toHaveBeenCalledWith({
            include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        role:true
                    }
                },
                class:{
                    include:{
                        standard:true
                    }
                },
               
            },
             orderBy:{
                    classId:"asc"
                }
        })

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"})

    })
})

describe("Get single student controller",()=>{
     beforeEach(()=>{
        jest.clearAllMocks();

        req={
            params:{
                id:1
            }
        }
        res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        }
    })


    test("should return 404 when student not found",async()=>{
        mockStudentFindUnique.mockResolvedValue(null);

        await getOneStd(req,res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error:"Student not found"});

        expect(mockStudentFindUnique).toHaveBeenCalledWith({
            where:{id:1},
            include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        role:true
                    }
                },
                class:{
                    include:{
                        standard:true
                    }
                }
            }   
        })

    })

    test("should return 200 when fetching student data successfully",async()=>{
        mockStudentFindUnique.mockResolvedValue({
                id:1,
                userId:8,
                firstName: "Arun",
                lastName: "Kumar",
                gender: "Male",
                classId:2,
                user:{
                id:8,
                name:"Arun Kumar",
                email:"arun@gmail.com",
                role:"student"
                }
    });

            await getOneStd(req,res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                {
                id:1,
                userId:8,
                firstName: "Arun",
                lastName: "Kumar",
                gender: "Male",
                classId:2,
                user:{
                id:8,
                name:"Arun Kumar",
                email:"arun@gmail.com",
                role:"student"
                }
                }
            );

            expect(mockStudentFindUnique).toHaveBeenCalledWith({
            where:{id:1},
            include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        role:true
                    }
                },
                class:{
                    include:{
                        standard:true
                    }
                }
            }   
        })
    })

    test("should return 500 when fetching student data fails",async()=>{
        mockStudentFindUnique.mockRejectedValue(new Error("Fetching teacher data fails"));

        await getOneStd(req,res);

        expect(mockStudentFindUnique).toHaveBeenCalledWith({
            where:{id:1},
            include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        role:true
                    }
                },class:{
                    include:{
                        standard:true
                    }
                }
            }   
        })
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"})

    })

})

describe("update student controller",()=>{

    beforeEach(()=>{
        jest.clearAllMocks();

        req={
            params:{
                id:1
            },

            body:{
                regNo:"REG1001",
                firstName:"Arun",
                lastName:"Kumar",
                gender:"Male",
                dob:"2000-01-01",
                phone:"9876543210",
                classId:1,
                addressLine1:"Address 1",
                addressLine2:"Address 2",
                city:"Chennai",
                state:"Tamil Nadu"
            }
        }

        res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        }
    })

    test("should return 404 when existing student not found",async()=>{

        mockStudentFindUnique.mockResolvedValue(null);

        await updateStd(req,res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error:"Student not found"});

        expect(mockStudentFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })

        expect(mockTransaction).not.toHaveBeenCalled();
        expect(mockUserUpdate).not.toHaveBeenCalled();
        expect(mockStudentUpdate).not.toHaveBeenCalled();

    })

    test("should return 200 when student data updated successfully",async()=>{
            mockStudentFindUnique.mockResolvedValue({
                id:1,
                userId:7,
                regNo:"REG1001",
                firstName:"Ranjith",
                lastName:"Kumar",
                gender:"Male",
                dob:new Date("2000-01-01"),
                phone:"9876543210",
                classId:1,
                addressLine1:"Address 1",
                addressLine2:"Address 2",
                city:"Chennai",
                state:"Tamil Nadu"
            })
        mockStudentUpdate.mockResolvedValue();
        mockUserUpdate.mockResolvedValue();

        mockTransaction.mockImplementation(async(callback)=>{
            return callback({
                student:{
                    update:mockStudentUpdate
                },
                user:{
                    update:mockUserUpdate
                }
            })
        })

        await updateStd(req,res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message:"Student updated successfully"});

        expect(mockStudentFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })

        expect(mockTransaction).toHaveBeenCalled();
        expect(mockStudentUpdate).toHaveBeenCalledWith({
            where:{id:1},
    data:expect.objectContaining({
        regNo:"REG1001",
        firstName:"Arun",
        lastName:"Kumar",
   
        })
    });
        expect(mockUserUpdate).toHaveBeenCalledWith({
            where:{
                id:7
            },
            data:{
                name:"Arun Kumar"
            }
        })
    })

    test("should return 500 when finding existing student fails",async()=>{
        mockStudentFindUnique.mockRejectedValue(new Error("Error,finding existing student fails"));

        await updateStd(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockStudentFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })

        expect(mockTransaction).not.toHaveBeenCalled();
        expect(mockUserUpdate).not.toHaveBeenCalled();
        expect(mockStudentUpdate).not.toHaveBeenCalled();
    })

    test("should return 500 when student update inside transaction fails",async()=>{
            mockStudentFindUnique.mockResolvedValue({
                id:1,
                userId:7,
                regNo:"REG1001",
                firstName:"Ranjith",
                lastName:"Kumar",
                gender:"Male",
                dob:new Date("2000-01-01"),
                phone:"9876543210",
                classId:1,
                addressLine1:"Address 1",
                addressLine2:"Address 2",
                city:"Chennai",
                state:"Tamil Nadu"
            })

        mockStudentUpdate.mockRejectedValue(new Error("student updation failed"));

        mockTransaction.mockImplementation(async(callback)=>{
            return callback({
                student:{
                    update:mockStudentUpdate
                },
                user:{
                    update:mockUserUpdate
                }
            })
        })

        await updateStd(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockStudentFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        });

        expect(mockTransaction).toHaveBeenCalled();
        expect(mockStudentUpdate).toHaveBeenCalledWith({
            where:{id:1},
    data:expect.objectContaining({
        regNo:"REG1001",
        firstName:"Arun",
        lastName:"Kumar"
        })
    });

    expect(mockUserUpdate).not.toHaveBeenCalled();
        
        
    })


    test("should return 500 when user update inside transaction fails",async()=>{
             mockStudentFindUnique.mockResolvedValue({
                id:1,
                userId:7,
                regNo:"REG1001",
                firstName:"Ranjith",
                lastName:"Kumar",
                gender:"Male",
                dob:new Date("2000-01-01"),
                phone:"9876543210",
                classId:1,
                addressLine1:"Address 1",
                addressLine2:"Address 2",
                city:"Chennai",
                state:"Tamil Nadu"
            })

        mockStudentUpdate.mockResolvedValue();
        mockUserUpdate.mockRejectedValue(new Error("user updation failed"));

        mockTransaction.mockImplementation(async(callback)=>{
            return callback({
                student:{
                    update:mockStudentUpdate
                },
                user:{
                    update:mockUserUpdate
                }
            })
        })

        await updateStd(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockStudentFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        });

        expect(mockTransaction).toHaveBeenCalled();
        expect(mockStudentUpdate).toHaveBeenCalledWith({
            where:{id:1},
    data:expect.objectContaining({
        regNo:"REG1001",
        firstName:"Arun",
        lastName:"Kumar"
        })
    });

    expect(mockUserUpdate).toHaveBeenCalledWith({
        where:{
                id:7
            },
            data:{
                name:"Arun Kumar"
            }

    });
        
        
    })
})

describe("Delete student controller",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
        req={
            params:{
                id:1
            }
        }
        res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        }
    })

    test("should return 404 when student not found",async()=>{
        mockStudentFindUnique.mockResolvedValue(null);

        await deleteStd(req,res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error:"Student not found"});

        expect(mockTransaction).not.toHaveBeenCalled();
        expect(mockStudentDelete).not.toHaveBeenCalled();
        expect(mockUserDelete).not.toHaveBeenCalled();

        expect(mockStudentFindUnique).toHaveBeenCalledWith({
            where:{id:1}
        })
    })

    test("should return 200 when student deleted successfully",async()=>{
        mockStudentFindUnique.mockResolvedValue({userId:7})

        mockStudentDelete.mockResolvedValue();
        mockUserDelete.mockResolvedValue();


        mockTransaction.mockImplementation(async(callback)=>{
            return callback({
            student:{
                    delete:mockStudentDelete
                },
                user:{
                    delete:mockUserDelete
                }
            })
        });

        
        await deleteStd(req,res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message:"Student data deleted successfully"});

        expect(mockTransaction).toHaveBeenCalled();
        expect(mockStudentDelete).toHaveBeenCalledWith({
            where:{
                id:1
            }
        });

        expect(mockUserDelete).toHaveBeenCalledWith({
            where:{
                id:7
            }
        })

        


    });

    test("should return 500 when finding student fails",async()=>{
        mockStudentFindUnique.mockRejectedValue(new Error("Error,Finding student failed"));

        await deleteStd(req,res);

        expect(mockTransaction).not.toHaveBeenCalled();
        expect(mockStudentDelete).not.toHaveBeenCalled();
        expect(mockUserDelete).not.toHaveBeenCalled();

        expect(mockStudentFindUnique).toHaveBeenCalledWith({
            where:{id:1}
        });

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});
    })

    test("should return 500 when student delete inside transaction fails",async()=>{
        mockStudentFindUnique.mockResolvedValue({userId:7});

        mockStudentDelete.mockRejectedValue(new Error("Student deleted failed"));

        mockTransaction.mockImplementation(async(callback)=>{
            return callback({
                student:{
                    delete:mockStudentDelete
                },
                user:{
                    delete:mockUserDelete
                }
            })
        })

        await deleteStd(req,res);

         expect(mockStudentFindUnique).toHaveBeenCalledWith({
            where:{id:1}
        });

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockTransaction).toHaveBeenCalled();

        expect(mockStudentDelete).toHaveBeenCalledWith({
            where:{
                id:1
            }
        });

        expect(mockUserDelete).not.toHaveBeenCalled();
    })

    test("should return 500 when user delete inside transaction fails",async()=>{
        mockStudentFindUnique.mockResolvedValue({userId:7});

        mockStudentDelete.mockResolvedValue();
        mockUserDelete.mockRejectedValue(new Error("user deleted failed"));

        mockTransaction.mockImplementation(async(callback)=>{
            return callback({
                student:{
                    delete:mockStudentDelete
                },
                user:{
                    delete:mockUserDelete
                }
            })
        })

        await deleteStd(req,res);

         expect(mockStudentFindUnique).toHaveBeenCalledWith({
            where:{id:1}
        });

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockTransaction).toHaveBeenCalled();

        expect(mockStudentDelete).toHaveBeenCalledWith({
            where:{
                id:1
            }
        });

        expect(mockUserDelete).toHaveBeenCalledWith({
            where:{
                id:7
            }
        });
    })
})