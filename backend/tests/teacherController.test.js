
const mockHash = jest.fn();
const mockFindUnique = jest.fn();
const mockUserCreate = jest.fn();
const mockTeacherCreate = jest.fn();
const mockTransaction = jest.fn();
const mockFindMany = jest.fn();
const mockTeacherFindUnique = jest.fn();
const mockUserUpdate = jest.fn();
const mockTeacherUpdate = jest.fn();
const mockTeacherDelete = jest.fn();
const mockUserDelete = jest.fn();

const mockPrisma = {
    user:{
        findUnique:mockFindUnique,
        create:mockUserCreate,
        update:mockUserUpdate,
        delete:mockUserDelete
    },
    teacher:{
        create:mockTeacherCreate,
        findMany:mockFindMany,
        findUnique:mockTeacherFindUnique,
        update:mockTeacherUpdate,
        delete:mockTeacherDelete
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


const {createTeacher, getTeacher, getSingleTeacher, updateTeacher, deleteTeacher} = require("../controllers/teacherController");



let req,res;

describe("create Teacher controller",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
        req={
            body:{
                name:"Janani Ram",
                email:"janani@gmail.com",
                password:"janani@123",
                empId:"Emp1012",
                firstName:"Janani",
                lastName:"Ram"
            }
        }
        res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        }
    })

    test("should return 422 when required fields are empty",async()=>{
        req.body.email="";
        req.body.name="";
        req.body.password="";
        req.body.empId="";

        await createTeacher(req,res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({error:"Please enter the mandatory fields"});

        expect(mockFindUnique).not.toHaveBeenCalled();
        expect(mockHash).not.toHaveBeenCalled();
        expect(mockUserCreate).not.toHaveBeenCalled();
        expect(mockTeacherCreate).not.toHaveBeenCalled();
        expect(mockTransaction).not.toHaveBeenCalled();

    })

    test("should return 422 when email is empty",async()=>{
        req.body.email="";

        await createTeacher(req,res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({error:"Please enter the mandatory fields"});

        expect(mockFindUnique).not.toHaveBeenCalled();
        expect(mockHash).not.toHaveBeenCalled();
        expect(mockUserCreate).not.toHaveBeenCalled();
        expect(mockTeacherCreate).not.toHaveBeenCalled();
        expect(mockTransaction).not.toHaveBeenCalled();
    })

    test("should return 422 when password is empty",async()=>{
        req.body.password="";

        await createTeacher(req,res);
        
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({error:"Please enter the mandatory fields"});

        expect(mockFindUnique).not.toHaveBeenCalled();
        expect(mockHash).not.toHaveBeenCalled();
        expect(mockUserCreate).not.toHaveBeenCalled();
        expect(mockTeacherCreate).not.toHaveBeenCalled();
        expect(mockTransaction).not.toHaveBeenCalled();
    })

    test("should return 422 when name is empty",async()=>{
        req.body.name="";

        await createTeacher(req,res);
        
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({error:"Please enter the mandatory fields"});

        expect(mockFindUnique).not.toHaveBeenCalled();
        expect(mockHash).not.toHaveBeenCalled();
        expect(mockUserCreate).not.toHaveBeenCalled();
        expect(mockTeacherCreate).not.toHaveBeenCalled();
        expect(mockTransaction).not.toHaveBeenCalled();
    })

    test("should return 422 when employee Id is empty",async()=>{
        req.body.empId="";

        await createTeacher(req,res);
        
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({error:"Please enter the mandatory fields"});

        expect(mockFindUnique).not.toHaveBeenCalled();
        expect(mockHash).not.toHaveBeenCalled();
        expect(mockUserCreate).not.toHaveBeenCalled();
        expect(mockTeacherCreate).not.toHaveBeenCalled();
        expect(mockTransaction).not.toHaveBeenCalled();
    })

    test("should return 409 when email already exists",async()=>{
        mockFindUnique.mockResolvedValue(true);

        await createTeacher(req,res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({error:"Email already exists"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                email:"janani@gmail.com"
            }
        })

        expect(mockHash).not.toHaveBeenCalled();
        expect(mockTransaction).not.toHaveBeenCalled();
        expect(mockUserCreate).not.toHaveBeenCalled();
        expect(mockTeacherCreate).not.toHaveBeenCalled();
    })

    test("should return 201 when teacher created successfully",async()=>{
        mockFindUnique.mockResolvedValue(null);
        mockHash.mockResolvedValue("hashed-password");

        mockUserCreate.mockResolvedValue({
            id:1,
            name:"Janani Ram",
            email:"janani@gmail.com",
            password:"hashed-password",
            role:"teacher"
        });
        mockTeacherCreate.mockResolvedValue();

        mockTransaction.mockImplementation(async(callback)=>{
            return callback({
                user:{
                    create:mockUserCreate
                },
                teacher:{
                    create:mockTeacherCreate
                }
            })
        })
        await createTeacher(req,res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({message:"Teacher created successfully"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                email:"janani@gmail.com"
            }
        })

        expect(mockHash).toHaveBeenCalledWith("janani@123",10);

        expect(mockUserCreate).toHaveBeenCalledWith({
            data:{
                name:"Janani Ram",
               email: "janani@gmail.com",
               password:"hashed-password",
               role:"teacher"
            }
        })

        expect(mockTeacherCreate).toHaveBeenCalledWith({
            data:expect.objectContaining({
                empId:"Emp1012",
                firstName:"Janani"

            })
        })

        expect(mockTransaction).toHaveBeenCalled()
    })

    test("should return 500 when finding existing user fails",async()=>{
        mockFindUnique.mockRejectedValue(new Error("Finding Existing user fails"));

        await createTeacher(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                email:"janani@gmail.com"
            }
        })

        expect(mockHash).not.toHaveBeenCalled();
        expect(mockTransaction).not.toHaveBeenCalled();
        expect(mockUserCreate).not.toHaveBeenCalled();
        expect(mockTeacherCreate).not.toHaveBeenCalled();

    })

    test("should return 500 when password hashing fails",async()=>{
        mockFindUnique.mockResolvedValue(null);

        mockHash.mockRejectedValue(new Error("password hashing fails"));

        await createTeacher(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                email:"janani@gmail.com"
            }
        })

        expect(mockHash).toHaveBeenCalledWith("janani@123",10);
        expect(mockTransaction).not.toHaveBeenCalled();
        expect(mockUserCreate).not.toHaveBeenCalled();
        expect(mockTeacherCreate).not.toHaveBeenCalled();

    })

    test("should return 500 when user creation inside transaction fails",async()=>{
        mockFindUnique.mockResolvedValue(null);
        mockHash.mockResolvedValue("hashed-password");

        mockUserCreate.mockRejectedValue(new Error("User creation failed"));

        mockTransaction.mockImplementation(async(callback)=>{
        return callback({
            user:{
                create:mockUserCreate
            },
            teacher:{
                create:mockTeacherCreate
            }
        })
    });
        await createTeacher(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                email:"janani@gmail.com"
            }
        })

        expect(mockHash).toHaveBeenCalledWith("janani@123",10);
        expect(mockTransaction).toHaveBeenCalled();
        expect(mockUserCreate).toHaveBeenCalledWith({
            data:{
                name:"Janani Ram",
                email: "janani@gmail.com",
                password:"hashed-password",
                role:"teacher"
            }
        });
        expect(mockTeacherCreate).not.toHaveBeenCalled();


    })

    test("should return 500 when teacher creation inside transaction fails",async()=>{
        mockFindUnique.mockResolvedValue(null);
        mockHash.mockResolvedValue("hashed-password");

        mockUserCreate.mockResolvedValue({
            id:1,
            name:"Janani Ram",
            email:"janani@gmail.com",
            password:"janani@123",
            role:"teacher"
        })
        mockTeacherCreate.mockRejectedValue(new Error("Teacher creation failed"));

        mockTransaction.mockImplementation(async(callback)=>{
        return callback({
            user:{
                create:mockUserCreate
            },
            teacher:{
                create:mockTeacherCreate
            }
        })
    });
        await createTeacher(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                email:"janani@gmail.com"
            }
        })

        expect(mockHash).toHaveBeenCalledWith("janani@123",10);
        expect(mockTransaction).toHaveBeenCalled();
        expect(mockUserCreate).toHaveBeenCalledWith({
            data:{
                name:"Janani Ram",
                email: "janani@gmail.com",
                password:"hashed-password",
                role:"teacher"
            }
        });
        expect(mockTeacherCreate).toHaveBeenCalledWith({
            data:expect.objectContaining({
                empId:"Emp1012",
                firstName:"Janani"
            })
        });


    })
})

describe("Get teacher controller",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();

        res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        }

    })

    test("should return 200 when fetching teacher data successfully",async()=>{
        mockFindMany.mockResolvedValue([
            {
                id:1,
                userId:7,
                firstName: "Janani",
                lastName: "Ram",
                gender: "Female",
                user:{
                id:7,
                name:"Janani Ram",
                email:"janani@gmail.com",
                role:"teacher"
                }

            },
                        {
                id:2,
                userId:8,
                firstName: "Hema",
                lastName: "Kannan",
                gender: "Female",
                user:{
                id:8,
                name:"Hema Kannan",
                email:"hema@.com",
                role:"teacher"
                }

            }
        ])

        await getTeacher(req,res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            [
            {
                id:1,
                userId:7,
                firstName: "Janani",
                lastName: "Ram",
                gender: "Female",
                user:{
                id:7,
                name:"Janani Ram",
                email:"janani@gmail.com",
                role:"teacher"
                }

            },
                        {
                id:2,
                userId:8,
                firstName: "Hema",
                lastName: "Kannan",
                gender: "Female",
                user:{
                id:8,
                name:"Hema Kannan",
                email:"hema@.com",
                role:"teacher"
                }

            }
        ]
        );

        expect(mockFindMany).toHaveBeenCalledWith({
            include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        role:true
                    }
                }
            }
        })
    })

    test("should return 500 when fetching teacher data fails",async()=>{
        mockFindMany.mockRejectedValue(new Error("Error fetching teacher data"));

        await getTeacher(req,res);

        expect(mockFindMany).toHaveBeenCalledWith({
            include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        role:true
                    }
                }
            }
        })

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"})

    })
})

describe("Get single teacher controller",()=>{
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


    test("should return 404 when teacher not found",async()=>{
        mockTeacherFindUnique.mockResolvedValue(null);

        await getSingleTeacher(req,res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error:"Teacher not found"});

        expect(mockTeacherFindUnique).toHaveBeenCalledWith({
            where:{id:1},
            include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        role:true
                    }
                }
            }   
        })

    })

    test("should return 200 when fetching teacher data successfully",async()=>{
        mockTeacherFindUnique.mockResolvedValue(  {
                id:1,
                userId:7,
                firstName: "Janani",
                lastName: "Ram",
                gender: "Female",
                user:{
                id:7,
                name:"Janani Ram",
                email:"janani@gmail.com",
                role:"teacher"
                }

            });

            await getSingleTeacher(req,res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                {
                id:1,
                userId:7,
                firstName: "Janani",
                lastName: "Ram",
                gender: "Female",
                user:{
                id:7,
                name:"Janani Ram",
                email:"janani@gmail.com",
                role:"teacher"
                }
                }
            );

            expect(mockTeacherFindUnique).toHaveBeenCalledWith({
            where:{id:1},
            include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        role:true
                    }
                }
            }   
        })
    })

    test("should return 500 when fetching teacher data fails",async()=>{
        mockTeacherFindUnique.mockRejectedValue(new Error("Fetching teacher data fails"));

        await getSingleTeacher(req,res);

        expect(mockTeacherFindUnique).toHaveBeenCalledWith({
            where:{id:1},
            include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        role:true
                    }
                }
            }   
        })
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"})

    })

})

describe("Update teacher controller",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
        req={
            params:{
                id:1
            },
          
        body:{
            empId:"Emp1012",
            firstName:"Janani",
            lastName:"Ram",
            gender:"Female",
            dob:"2000-01-01",
            phone:"9876543210",
            classIncharge:"A",
            classSection:"A",
            subject:"Maths",
            qualification:"MCA",
            addressLine1:"Address 1",
            addressLine2:"Address 2",
            state:"Tamil Nadu",
            city:"Chennai"
        }
        }
        res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        }
    })

    test("should return 404 when existing teacher not found",async()=>{

        mockTeacherFindUnique.mockResolvedValue(null);

        await updateTeacher(req,res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error:"Teacher not found"});

        expect(mockTeacherFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })

        expect(mockTransaction).not.toHaveBeenCalled();
        expect(mockUserUpdate).not.toHaveBeenCalled();
        expect(mockTeacherUpdate).not.toHaveBeenCalled();

    })

    test("should return 200 when teacher data updated successfully",async()=>{
        mockTeacherFindUnique.mockResolvedValue({
            id:1,
        userId:7,
        empId:"Emp1001",
        firstName:"Karthika",
        lastName:"Ram",
        gender:"Male",
        dob:new Date("2000-01-01"),
        phone:"902321100",
        classIncharge:"A",
        classSection:"A",
        subject:"Tamil",
        qualification:"B.Ed",
        addressLine1:"2/44 kamaraj nagar",
        addressLine2:"near old bus stand",
        city:"Karaikal",
        state:"Tamil Nadu"
        })

        mockTeacherUpdate.mockResolvedValue();
        mockUserUpdate.mockResolvedValue();

        mockTransaction.mockImplementation(async(callback)=>{
            return callback({
                teacher:{
                    update:mockTeacherUpdate
                },
                user:{
                    update:mockUserUpdate
                }
            })
        })

        await updateTeacher(req,res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message:"Teacher data updated successfully"});

        expect(mockTeacherFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })

        expect(mockTransaction).toHaveBeenCalled();
        expect(mockTeacherUpdate).toHaveBeenCalledWith({
            where:{id:1},
    data:expect.objectContaining({
        empId:"Emp1012",
        firstName:"Janani",
        lastName:"Ram",
        subject:"Maths"
        })
    });
        expect(mockUserUpdate).toHaveBeenCalledWith({
            where:{
                id:7
            },
            data:{
                name:"Janani Ram"
            }
        })
    })

    test("should return 500 when finding existing teacher fails",async()=>{
        mockTeacherFindUnique.mockRejectedValue(new Error("Error,finding existing teacher fails"));

        await updateTeacher(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockTeacherFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })

        expect(mockTransaction).not.toHaveBeenCalled();
        expect(mockUserUpdate).not.toHaveBeenCalled();
        expect(mockTeacherUpdate).not.toHaveBeenCalled();
    })

    test("should return 500 when teacher update inside transaction fails",async()=>{
        mockTeacherFindUnique.mockResolvedValue({
            id:1,
        userId:7,
        empId:"Emp1001",
        firstName:"Karthika",
        lastName:"Ram",
        gender:"Male",
        dob:new Date("2000-01-01"),
        phone:"902321100",
        classIncharge:"A",
        classSection:"A",
        subject:"Tamil",
        qualification:"B.Ed",
        addressLine1:"2/44 kamaraj nagar",
        addressLine2:"near old bus stand",
        city:"Karaikal",
        state:"Tamil Nadu"
        })

        mockTeacherUpdate.mockRejectedValue(new Error("Teacher updation failed"));

        mockTransaction.mockImplementation(async(callback)=>{
            return callback({
                teacher:{
                    update:mockTeacherUpdate
                },
                user:{
                    update:mockUserUpdate
                }
            })
        })

        await updateTeacher(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockTeacherFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        });

        expect(mockTransaction).toHaveBeenCalled();
        expect(mockTeacherUpdate).toHaveBeenCalledWith({
            where:{id:1},
    data:expect.objectContaining({
        empId:"Emp1012",
        firstName:"Janani",
        lastName:"Ram",
        subject:"Maths"
        })
    });

    expect(mockUserUpdate).not.toHaveBeenCalled();
        
        
    })


      test("should return 500 when user update inside transaction fails",async()=>{
        mockTeacherFindUnique.mockResolvedValue({
            id:1,
        userId:7,
        empId:"Emp1001",
        firstName:"Karthika",
        lastName:"Ram",
        gender:"Male",
        dob:new Date("2000-01-01"),
        phone:"902321100",
        classIncharge:"A",
        classSection:"A",
        subject:"Tamil",
        qualification:"B.Ed",
        addressLine1:"2/44 kamaraj nagar",
        addressLine2:"near old bus stand",
        city:"Karaikal",
        state:"Tamil Nadu"
        })

        mockTeacherUpdate.mockResolvedValue();
        mockUserUpdate.mockRejectedValue(new Error("Teacher updation failed"));

        mockTransaction.mockImplementation(async(callback)=>{
            return callback({
                teacher:{
                    update:mockTeacherUpdate
                },
                user:{
                    update:mockUserUpdate
                }
            })
        })

        await updateTeacher(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockTeacherFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        });

        expect(mockTransaction).toHaveBeenCalled();
        expect(mockTeacherUpdate).toHaveBeenCalledWith({
            where:{id:1},
    data:expect.objectContaining({
        empId:"Emp1012",
        firstName:"Janani",
        lastName:"Ram",
        subject:"Maths"
        })
    });

    expect(mockUserUpdate).toHaveBeenCalledWith({
        where:{
                id:7
            },
            data:{
                name:"Janani Ram"
            }

    });
        
        
    })

})

describe("Delete Teacher controller",()=>{
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

    test("should return 404 when teacher not found",async()=>{
        mockTeacherFindUnique.mockResolvedValue(null);

        await deleteTeacher(req,res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error:"Teacher not found."});

        expect(mockTransaction).not.toHaveBeenCalled();
        expect(mockTeacherDelete).not.toHaveBeenCalled();
        expect(mockUserDelete).not.toHaveBeenCalled();

        expect(mockTeacherFindUnique).toHaveBeenCalledWith({
            where:{id:1}
        })
    })

    test("should return 200 when teacher deleted successfully",async()=>{
        mockTeacherFindUnique.mockResolvedValue({userId:7})

        mockTeacherDelete.mockResolvedValue();
        mockUserDelete.mockResolvedValue();


        mockTransaction.mockImplementation(async(callback)=>{
            return callback({
                teacher:{
                    delete:mockTeacherDelete
                },
                user:{
                    delete:mockUserDelete
                }
            })
        });

        
        await deleteTeacher(req,res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message:"Teacher data deleted successfully"});

        expect(mockTransaction).toHaveBeenCalled();
        expect(mockTeacherDelete).toHaveBeenCalledWith({
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

    test("should return 500 when finding teacher fails",async()=>{
        mockTeacherFindUnique.mockRejectedValue(new Error("Error,Finding teacher failed"));

        await deleteTeacher(req,res);

        expect(mockTransaction).not.toHaveBeenCalled();
        expect(mockTeacherDelete).not.toHaveBeenCalled();
        expect(mockUserDelete).not.toHaveBeenCalled();

        expect(mockTeacherFindUnique).toHaveBeenCalledWith({
            where:{id:1}
        });

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});
    })

    test("should return 500 when teacher delete inside transaction fails",async()=>{
        mockTeacherFindUnique.mockResolvedValue({userId:7});

        mockTeacherDelete.mockRejectedValue(new Error("Teacher deleted failed"));

        mockTransaction.mockImplementation(async(callback)=>{
            return callback({
                teacher:{
                    delete:mockTeacherDelete
                },
                user:{
                    delete:mockUserDelete
                }
            })
        })

        await deleteTeacher(req,res);

         expect(mockTeacherFindUnique).toHaveBeenCalledWith({
            where:{id:1}
        });

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockTransaction).toHaveBeenCalled();

        expect(mockTeacherDelete).toHaveBeenCalledWith({
            where:{
                id:1
            }
        });

        expect(mockUserDelete).not.toHaveBeenCalled();
    })

    test("should return 500 when user delete inside transaction fails",async()=>{
        mockTeacherFindUnique.mockResolvedValue({userId:7});

        mockTeacherDelete.mockResolvedValue();
        mockUserDelete.mockRejectedValue(new Error("user deleted failed"));

        mockTransaction.mockImplementation(async(callback)=>{
            return callback({
                teacher:{
                    delete:mockTeacherDelete
                },
                user:{
                    delete:mockUserDelete
                }
            })
        })

        await deleteTeacher(req,res);

         expect(mockTeacherFindUnique).toHaveBeenCalledWith({
            where:{id:1}
        });

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockTransaction).toHaveBeenCalled();

        expect(mockTeacherDelete).toHaveBeenCalledWith({
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