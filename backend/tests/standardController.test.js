const mockFindUnique = jest.fn();
const mockCreate = jest.fn();
const mockFindMany = jest.fn();
const mockFindFirst = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

const mockPrisma = {
    standard:{
        create:mockCreate,
        findUnique:mockFindUnique,
        findMany:mockFindMany,
        findFirst:mockFindFirst,
        update:mockUpdate,
        delete:mockDelete
    }
}

jest.mock("../prisma/prisma",()=>{
    return mockPrisma;
})
const { createStandard, getStandards, getOneStandard, updateStandard, deleteStandard } = require("../controllers/standardController");

let req,res;
describe("create standard controller",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();

        req={
            body:{
                name:"LKG"
            }
        }
        res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        }
    })

    test("should return 422 when name is empty",async()=>{
        req.body.name="";

        await createStandard(req,res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({error:"Please enter the Standard name"});

        expect(mockFindUnique).not.toHaveBeenCalled();
        expect(mockCreate).not.toHaveBeenCalled();


    })

    test("should return 409 when standard name is already exists",async()=>{
        mockFindUnique.mockResolvedValue(true);

        await createStandard(req,res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({error:"Standard name already exists."});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                name:"LKG"
            }
        })

        expect(mockCreate).not.toHaveBeenCalled();
    })

    test("should return 201 when standard created succesfully",async()=>{
        mockFindUnique.mockResolvedValue(null);
        mockCreate.mockResolvedValue({
            name:"LKG"
        })

        await createStandard(req,res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            data:{
                name:"LKG"
            },message:"Standard created successfully"
        });

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                name:"LKG"
            }
        })

        expect(mockCreate).toHaveBeenCalledWith({
            data:{
                name:"LKG"
            }
        })
    })

    test("should return 500 when finding a standard fails",async()=>{
        mockFindUnique.mockRejectedValue(new Error("Error,finding a standard failed"));

        await createStandard(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later."});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                name:"LKG"
            }
        })

        expect(mockCreate).not.toHaveBeenCalled();

    })

    test("should return 500 when standard creation fails",async()=>{
        mockFindUnique.mockResolvedValue(null);
        mockCreate.mockRejectedValue(new Error("Standard creation failed"));

        await createStandard(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later."});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                name:"LKG"
            }
        });

        expect(mockCreate).toHaveBeenCalledWith({
            data:{
                name:"LKG"
            }
        })
    })
})

describe("Get Standard controller",()=>{

    beforeEach(()=>{
        jest.clearAllMocks();

        res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        }
    })

    test("Should return 200 when fetching standard data successfully",async()=>{
            mockFindMany.mockResolvedValue([
        {
        id:1,
        name:"LKG"
    },
    {
        id:2,
        name:"UKG"
    }
    ]);

    await getStandards(req,res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
        {
            id:1,
            name:"LKG"
        },{
            id:2,
            name:"UKG"
        }
    ])

        expect(mockFindMany).toHaveBeenCalledWith({
        orderBy:{
            id:"asc"
        }
    })
    })

    test("should return 500 when fetching standard data fails",async()=>{
        mockFindMany.mockRejectedValue(new Error("Fetching standard failed"));

        await getStandards(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later."});

        expect(mockFindMany).toHaveBeenCalledWith({
            orderBy:{
                id:"asc"
            }
        })
    })



})

describe("Get single standard controller",()=>{
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

    test("should return 404 when standard not found",async()=>{
        mockFindUnique.mockResolvedValue(null);

        await getOneStandard(req,res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error:"Standard not found"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })
    })

    test("should return 200 when fetching standard data succesfully",async()=>{
        mockFindUnique.mockResolvedValue({
            id:1,
            name:"LKG"
        });

        await getOneStandard(req,res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            id:1,
            name:"LKG"
        })

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })
    })

    test("should return 500 when fetching standard fails",async()=>{
        mockFindUnique.mockRejectedValue(new Error("Fetching standard failed"));

        await getOneStandard(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later."});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })
    })
})

describe("update standard controller",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
        req={
            body:{
                name:"LKG"
            },
            params:{
                id:1
            }
        }
        res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        }
    })

    test("should return 422 when standard name is empty",async()=>{
        req.body.name="";

        await updateStandard(req,res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({error:"Please enter the standard name"});

        expect(mockFindUnique).not.toHaveBeenCalled();
        expect(mockFindFirst).not.toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();

    })

    test("should return 404 when standard not found",async()=>{
        mockFindUnique.mockResolvedValue(null);

        await updateStandard(req,res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error:"Standard not found."});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })

        expect(mockFindFirst).not.toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();
    })

    test("should return 409 when standard already exists",async()=>{
        mockFindUnique.mockResolvedValue({
            id:1,
            name:"UKG"
        });

        mockFindFirst.mockResolvedValue({
            id:2,
            name:"LKG"
        });

        await updateStandard(req,res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({error:"Standard already exists"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })

        expect(mockFindFirst).toHaveBeenCalledWith({
            where:{
                name:"LKG",
                id:{
                    not:1
                }
            }
        })

        expect(mockUpdate).not.toHaveBeenCalled()
    })

    test("should return 200 when standard updated successfully",async()=>{
        mockFindUnique.mockResolvedValue({
            id:1,
            name:"UKG"
        });
        mockFindFirst.mockResolvedValue(null);

        mockUpdate.mockResolvedValue();
        await updateStandard(req,res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message:"Standard updated successfully"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })

        expect(mockFindFirst).toHaveBeenCalledWith({
            where:{
                name:"LKG",
                id:{
                    not:1
                }
            }
        })

        expect(mockUpdate).toHaveBeenCalledWith({
            where:{
                id:1
            },
            data:{
                name:"LKG"
            }
        })

    })

    test("should return 500 when finding standard fails",async()=>{
        mockFindUnique.mockRejectedValue(new Error("Error,finding standard failed"));

        await updateStandard(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message:"Something went wrong, Please try again later"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })

        expect(mockFindFirst).not.toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();
    })

    test("should return 500 when finding existing standard fails",async()=>{
        mockFindUnique.mockResolvedValue(true);

        mockFindFirst.mockRejectedValue(new Error("Error,Finding existing standard failed"));

        await updateStandard(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message:"Something went wrong, Please try again later"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })

        expect(mockFindFirst).toHaveBeenCalledWith({
            where:{
                name:"LKG",
                id:{
                    not:1
                }
            }
        })

        expect(mockUpdate).not.toHaveBeenCalled();
    })

    test("should return 500 when updating standard fails",async()=>{
        mockFindUnique.mockResolvedValue(true);

        mockFindFirst.mockResolvedValue(null)
        mockUpdate.mockRejectedValue(new Error("Standard updated failed."));

        await updateStandard(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message:"Something went wrong, Please try again later"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })

        expect(mockFindFirst).toHaveBeenCalledWith({
            where:{
                name:"LKG",
                id:{
                    not:1
                }
            }
        })

        expect(mockUpdate).toHaveBeenCalledWith({
            where:{
                id:1
            },data:{
                name:"LKG"
            }
        });
    })
})

describe("Delete standard controller",()=>{
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

    test("should return 404 when standard not found",async()=>{
        mockFindUnique.mockResolvedValue(null);

        await deleteStandard(req,res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error:"Standard not found."})

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })

        expect(mockDelete).not.toHaveBeenCalled();


    })

    test("should return 200 when standard deleted successfully",async()=>{
        mockFindUnique.mockResolvedValue({
            id:1,
            name:"LKG"
        })

        mockDelete.mockResolvedValue();

        await deleteStandard(req,res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message:"Standard deleted Successfully",data:{
            id:1,
            name:"LKG"
        }})

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })

        expect(mockDelete).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })
    })

    test("should return 500 when finding a standard fails",async()=>{
        mockFindUnique.mockRejectedValue(new Error("Error,Finding standard failed"));

        await deleteStandard(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })

        expect(mockDelete).not.toHaveBeenCalled();
    })

    test("should return 500 when standard deletion fails",async()=>{
        mockFindUnique.mockResolvedValue({
            id:1,
            name:"LKG"
        });

        mockDelete.mockRejectedValue(new Error("standard deletion failed"))
  
        await deleteStandard(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })

        expect(mockDelete).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })
    })
})