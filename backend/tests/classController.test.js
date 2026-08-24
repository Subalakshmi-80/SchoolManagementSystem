const mockFindFirst = jest.fn();
const mockCreate = jest.fn();
const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

const mockPrisma={
    class:{
        findFirst:mockFindFirst,
        create:mockCreate,
        findMany:mockFindMany,
        findUnique:mockFindUnique,
        update:mockUpdate,
        delete:mockDelete
    }

}

jest.mock("../prisma/prisma",()=>{
    return mockPrisma
})

const {createClass,getClass,getSingleClass,updateClass,deleteClass} = require('../controllers/classesController');

let req,res;


describe("create class controller",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
        req={
            body:{
                name:"A",
                standard_id:1
            }
        }

        res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        }
    })
    test("should return 422 when class name is provided but standard empty",async()=>{
        req.body.standard_id="";

        await createClass(req,res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({error:"Please enter class name and select standard"})

        expect(mockFindFirst).not.toHaveBeenCalled();

    })

        test("should return 422 when standard is provided but class name is empty",async()=>{
        req.body.name="";

        await createClass(req,res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({error:"Please enter class name and select standard"})

        expect(mockFindFirst).not.toHaveBeenCalled();

    })

        test("should return 422 when class name and standard are empty",async()=>{
        req.body.name="";
        req.body.standard_id="";

        await createClass(req,res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({error:"Please enter class name and select standard"})

        expect(mockFindFirst).not.toHaveBeenCalled();

    })

    test("should return 409 when class alresdy exists",async()=>{
        mockFindFirst.mockResolvedValue(true);

        await createClass(req,res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({error:"Class Already Exists"});
        expect(mockCreate).not.toHaveBeenCalled();
    
        expect(mockFindFirst).toHaveBeenCalledWith({
            where:{
                name:"A",
                standardId:1
            }
        })
        
    })

    test("should return 201 when successful class created",async()=>{
        mockFindFirst.mockResolvedValue(null);

        mockCreate.mockResolvedValue({

                name:"A",
                standardId:1

        });

        await createClass(req,res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({data: {"name": "A", "standardId": 1}, message: "Class created successfully"})
      
        expect(mockFindFirst).toHaveBeenCalledWith({
            where:{
                name:"A",
                standardId:1
            }
        })

        expect(mockCreate).toHaveBeenCalledWith({
            data:{
                name:"A",
                standardId:1
            }
        })
    })

    test("should return 500 when cannot find existing class",async()=>{
        mockFindFirst.mockRejectedValue(new Error("Error while find a existing class"));

        await createClass(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong, Please try again later"})

        expect(mockCreate).not.toHaveBeenCalled()
    })

    test("should return 500 when creating a new class",async()=>{
        mockFindFirst.mockResolvedValue(null);

        mockCreate.mockRejectedValue(new Error("Create new class fails"));

        await createClass(req,res);

        expect(mockFindFirst).toHaveBeenCalledWith({
            where:{
                name:"A",
                standardId:1
            }
        })

        expect(mockCreate).toHaveBeenCalledWith({
            data:{
                name:"A",
                standardId:1
            }
        })

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong, Please try again later"})

        
    })
})

describe("get class controller",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
        res={   
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        }
    })

    test("should return 200 when it return all class data",async()=>{
        mockFindMany.mockResolvedValue([
            {name:"A",standardId:1},
            {name:"B",standardId:1}
        ]);

        await getClass(req,res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith( [
            {"name": "A", "standardId": 1}, 
            {"name": "B", "standardId": 1}
        ]);

        expect(mockFindMany).toHaveBeenCalledWith({
            include:{
                standard:true
            },
            orderBy:{
                id:"asc"
            }
        })
    })

    test("should return 500 when fetching class data fails",async()=>{
        mockFindMany.mockRejectedValue(new Error("Get class data fails"));

        await getClass(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockFindMany).toHaveBeenCalledWith({
            include:{
                standard:true
            },
            orderBy:{
                id:"asc"
            }
        })
    })
})

describe("get single class controller",()=>{
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

    test("should return 404 when class not found",async()=>{
        mockFindUnique.mockResolvedValue(null);

        await getSingleClass(req,res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error:"Class not found"})
    })

    test("should return 200 when fetching a single class data correctly",async()=>{
        mockFindUnique.mockResolvedValue({
            name:"A",
            standardId:1
        })

        await getSingleClass(req,res);

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            },
            include:{
                standard:true
            }
        })

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({"name": "A", "standardId": 1})
    })

    test("should return 500 when fetching a single class data fails",async()=>{
        mockFindUnique.mockRejectedValue(new Error("Fetching class fails"));

        await getSingleClass(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            },
            include:{
                standard:true
            }
        })
    })
})

describe("update class controller",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();

        req={
            body:{
                name:"A",
                standardId:1
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

    test("should return 422 when class name and standard are empty",async()=>{
        req.body.name="";
        req.body.standardId="";

        await updateClass(req,res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({error:"Please enter the class and select the standard"});

        expect(mockFindUnique).not.toHaveBeenCalled();
        expect(mockFindFirst).not.toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();

    })

   test("should return 422 when class name is provided but standard is empty",async()=>{
        req.body.standardId="";

        await updateClass(req,res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({error:"Please enter the class and select the standard"});

        expect(mockFindUnique).not.toHaveBeenCalled();
        expect(mockFindFirst).not.toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();

    })

   test("should return 422 when standard is provided but class name is empty",async()=>{
        req.body.name="";

        await updateClass(req,res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({error:"Please enter the class and select the standard"});

        expect(mockFindUnique).not.toHaveBeenCalled();
        expect(mockFindFirst).not.toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();

    })

    test("should return 404 when class is not found",async()=>{
        mockFindUnique.mockResolvedValue(null);

        await updateClass(req,res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error:"Class not found"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })

        expect(mockFindFirst).not.toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled()
    })

    test("should return 409 when class already exists",async()=>{
        mockFindUnique.mockResolvedValue({name:"A",standardId:1})

        mockFindFirst.mockResolvedValue(true);

        await updateClass(req,res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({error:"Class Already Exists"});

        expect(mockFindUnique).toHaveBeenCalledWith({where:{id:1}});
        expect(mockFindFirst).toHaveBeenCalledWith({
            where:{
                name:"A",
                standardId:1,
                id:{
                    not:1
                }
            }
        })

        expect(mockUpdate).not.toHaveBeenCalled();
    })

    test("should return 200 when class update successfully",async()=>{
        mockFindUnique.mockResolvedValue({name:"B",standardId:1});

        mockFindFirst.mockResolvedValue(null);

        mockUpdate.mockResolvedValue();

        await updateClass(req,res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message:"Class Updated Successfully"});

        expect(mockFindUnique).toHaveBeenCalledWith({where:{id:1}});
        expect(mockFindFirst).toHaveBeenCalledWith({
            where:{
                name:"A",
                standardId:1,
                id:{
                    not:1
                }
            }
        })

        expect(mockUpdate).toHaveBeenCalledWith({
            where:{
                id:1
            },data:{
                name:"A",
                standardId:1
            }
        })
    })

    test("should return 500 when finding class fails",async()=>{
        mockFindUnique.mockRejectedValue(new Error("Finding a class fails"));

        await updateClass(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockFindFirst).not.toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        });
    })

    test("should return 500 when checking existing class fails",async()=>{
        mockFindUnique.mockResolvedValue({name:"A",standardId:1});

        mockFindFirst.mockRejectedValue(new Error("Checking existing class fails"));

        await updateClass(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockUpdate).not.toHaveBeenCalled();

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        });

        expect(mockFindFirst).toHaveBeenCalledWith({
            where: {
                name: "A",
                standardId: 1,
                id: {
                    not: 1
                }
            
            }
        
        })
    })

    test("should return 500 when updating class fails",async()=>{
        mockFindUnique.mockResolvedValue({name:"A",standardId:1});

        mockFindFirst.mockResolvedValue(null);

        mockUpdate.mockRejectedValue(new Error("updating class fails"))

        await updateClass(req,res);

    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        });

        expect(mockFindFirst).toHaveBeenCalledWith({
            where: {
                name: "A",
                standardId: 1,
                id: {
                    not: 1
                }
            }
        });

        expect(mockUpdate).toHaveBeenCalledWith({
            where: {
                id: 1
            },
            data: {
                name: "A",
                standardId: 1
            }
        });


        
    })

})


describe("delete class controller",()=>{
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

    test("should return 404 when class not found",async()=>{
        mockFindUnique.mockResolvedValue(null);

        await deleteClass(req,res);

        expect(mockDelete).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error:"Class not found."});
    })

    test("should return 200 when class is deleted successfully",async()=>{
        mockFindUnique.mockResolvedValue({name:"A",standardId:1});

        mockDelete.mockResolvedValue();

        await deleteClass(req,res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({data:{name:"A",standardId:1},message:"Class deleted successfully"})
        
        expect(mockFindUnique).toHaveBeenCalledWith({where:{id:1}});
        expect(mockDelete).toHaveBeenCalledWith({where:{id:1}})
    
    })

    test("should return 500 when finding a class fails",async()=>{
        mockFindUnique.mockRejectedValue(new Error("Finding a class fails"));

        await deleteClass(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockDelete).not.toHaveBeenCalled();

        expect(mockFindUnique).toHaveBeenCalledWith({where:{id:1}})
    })

    test("should return 500 when deleting class fails",async()=>{
        mockFindUnique.mockResolvedValue({name:"A",standardId:1});

        mockDelete.mockRejectedValue(new Error("class delete fails"));

        await deleteClass(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockFindUnique).toHaveBeenCalledWith({where:{id:1}});
        expect(mockDelete).toHaveBeenCalledWith({where:{id:1}})
    })
})