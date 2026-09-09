const mockFindUnique = jest.fn();
const mockCreate = jest.fn();
const mockFindMany= jest.fn();
const mockFindFirst = jest.fn();
const mockUpdate = jest.fn();
const mockDelete= jest.fn()

const mockPrisma = {
    subject:{
        findUnique:mockFindUnique,
        create:mockCreate,
        findMany:mockFindMany,
        findFirst:mockFindFirst,
        update:mockUpdate,
        delete:mockDelete
    }
}

jest.mock("../prisma/prisma",()=>{
    return mockPrisma
})
const {createSubject, getSubjects, getOneSubject, updateSubject, deleteSubject} = require("../controllers/subjectController");


let req,res;

describe("create subject controller",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
        req={
            body:{
                subject_name:"Maths"
            }
        }

        res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        }
    })

    test("should return 422 when subject name is empty",async()=>{
        req.body.subject_name="";
        await createSubject(req,res);
         
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({error:"Please enter the Subject name "});

        expect(mockFindUnique).not.toHaveBeenCalled();
        expect(mockCreate).not.toHaveBeenCalled();
    })

    test("should return 409 when subject name already exists",async()=>{
        mockFindUnique.mockResolvedValue(true);

        await createSubject(req,res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({error:"Subject name already exists"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                subjectName:"Maths"
            }
        })

        expect(mockCreate).not.toHaveBeenCalled();
    })

    test("should return 201 when subject created successfully",async()=>{
        mockFindUnique.mockResolvedValue(null);

        mockCreate.mockResolvedValue({
            subjectName:"Maths"
        })

        await createSubject(req,res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            data:{
                subjectName:"Maths"
            },
            message:"Subject Created Successfully."
        })

        expect(mockFindUnique).toHaveBeenCalledWith({where:{subjectName:"Maths" }});
        expect(mockCreate).toHaveBeenCalledWith({data:{subjectName:"Maths"}})
    })

    test("should return 500 when cannot find existing subject",async()=>{
        mockFindUnique.mockRejectedValue(new Error("Error while finding a existing subject"));

        await createSubject(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later."});

        expect(mockFindUnique).toHaveBeenCalledWith({where:{subjectName:"Maths"}});
        expect(mockCreate).not.toHaveBeenCalled()
    })

    test("should return 500 when creating a new subject fails",async()=>{
        mockFindUnique.mockResolvedValue(null);

        mockCreate.mockRejectedValue(new Error("Subject creation failed"));
        await createSubject(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later."});

        expect(mockFindUnique).toHaveBeenCalledWith({where:{subjectName:"Maths"}});
        expect(mockCreate).toHaveBeenCalledWith({
            data:{
                subjectName:"Maths"
            }
        })

    })
})

describe("Get subject controller",()=>{

    beforeEach(()=>{
        jest.clearAllMocks();

        res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        }
    })

    test("should return 200 when fetching subject data successfully",async()=>{
        mockFindMany.mockResolvedValue([
            {id:1,subjectName:"Maths"},
            {id:2,subjectName:"Tamil"}
        ])

        await getSubjects(req,res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
            {id:1,subjectName:"Maths"},
            {id:2,subjectName:"Tamil"}
        ])

        expect(mockFindMany).toHaveBeenCalledWith({
            orderBy:{
                id:"asc"
            }
        })
    })

    test("should return 500 when fetching subject name failed",async()=>{
        mockFindMany.mockRejectedValue(new Error("Error fetching subject data"));

        await getSubjects(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later."})

        expect(mockFindMany).toHaveBeenCalledWith({
            orderBy:{
                id:"asc"
            }
        })
    })

})

describe("Get single controller",()=>{
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

    test("should return 404 when subject not found",async()=>{
        mockFindUnique.mockResolvedValue(null);

        await getOneSubject(req,res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error:"Subject not found."});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{id:1}
        })
    })

    test("should return 200 when fetch subject data successfully",async()=>{
        mockFindUnique.mockResolvedValue({id:1,subjectName:"Maths"});

        await getOneSubject(req,res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({id:1,subjectName:"Maths"})

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })
    })

    test("should return 500 when fetching subject failed",async()=>{
        mockFindUnique.mockRejectedValue(new Error("Error fetching subject data"));

        await getOneSubject(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later."})

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            }
        })
    })
})

describe("update subject controller",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();

        req={
            body:{
                subject_name:"English"
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

    test("should return 422 when subject name is empty",async()=>{
        req.body.subject_name="";

        await updateSubject(req,res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({error:"Please enter the subject name"});

        expect(mockFindUnique).not.toHaveBeenCalled();
        expect(mockFindFirst).not.toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();
    })

    test("should return 404 when subject is not found",async()=>{
        mockFindUnique.mockResolvedValue(null);

        await updateSubject(req,res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error:"Subject not found."});

        expect(mockFindUnique).toHaveBeenCalledWith({where:{id:1}});
        expect(mockFindFirst).not.toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();

    })

    test("should return 409 when subject already exists",async()=>{
        mockFindUnique.mockResolvedValue(true);

        mockFindFirst.mockResolvedValue(true);

        await updateSubject(req,res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({error:"Subject already exists."});

        expect(mockFindUnique).toHaveBeenCalledWith({where:{id:1}});
        expect(mockFindFirst).toHaveBeenCalledWith({
            where:{
                subjectName:"English",
                id:{
                    not:1
                }
            }
        });
        expect(mockUpdate).not.toHaveBeenCalled();

    })

    test("should return 200 when subject name updated successfully",async()=>{
        mockFindUnique.mockResolvedValue(true);
        mockFindFirst.mockResolvedValue(null);

        mockUpdate.mockResolvedValue();

        await updateSubject(req,res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message:"Subject updated successfully."});

        expect(mockFindUnique).toHaveBeenCalledWith({where:{id:1}});
        expect(mockFindFirst).toHaveBeenCalledWith({
            where:{
                subjectName:"English",
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
                subjectName:"English"
            }
        })
    })

    test("should return 500 when finding subject fails",async()=>{
        mockFindUnique.mockRejectedValue(new Error("Error while finding a subject"));

        await updateSubject(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later."});

        expect(mockFindUnique).toHaveBeenCalledWith({where:{id:1}});
        expect(mockFindFirst).not.toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();
    })

    test("should return 500 when checking existing subject fails",async()=>{
        mockFindUnique.mockResolvedValue(true);
        mockFindFirst.mockRejectedValue(new Error("Error,while checking existing subject"));

        await updateSubject(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later."});

        expect(mockFindUnique).toHaveBeenCalledWith({where:{id:1}});
        expect(mockFindFirst).toHaveBeenCalledWith({
            where:{
                subjectName:"English",
                id:{
                    not:1
                }
            }
        });
        expect(mockUpdate).not.toHaveBeenCalled();

    })

    test("should return 500 when updating subject fails",async()=>{
        mockFindUnique.mockResolvedValue(true);
        mockFindFirst.mockResolvedValue(null);

        mockUpdate.mockRejectedValue(new Error("Updating subject failed"));

        await updateSubject(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later."});

        expect(mockFindUnique).toHaveBeenCalledWith({where:{id:1}});
        expect(mockFindFirst).toHaveBeenCalledWith({
            where:{
                subjectName:"English",
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
                subjectName:"English"
            }
        })
    })
})

describe("delete subject controller",()=>{
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

    test("should return 404 when subject not found",async()=>{
        mockFindUnique.mockResolvedValue(null);

        await deleteSubject(req,res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error:"Subject not found."});

        expect(mockFindUnique).toHaveBeenCalledWith({where:{id:1}})

        expect(mockDelete).not.toHaveBeenCalled()

    })

    test("should return 200 when subject deleted successfully",async()=>{
        mockFindUnique.mockResolvedValue({
            id:1,
            subjectName:"Maths"
        });

        mockDelete.mockResolvedValue();

        await deleteSubject(req,res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            data:{
                id:1,
                subjectName:"Maths"
            },
            message:"Subject deleted Successfully."
        });

        
        expect(mockFindUnique).toHaveBeenCalledWith({where:{id:1}});
        expect(mockDelete).toHaveBeenCalledWith({where:{id:1}})

    })

    test("should return 500 when finding subject fails",async()=>{
        mockFindUnique.mockRejectedValue(new Error("Finding Subject failed"));

        await deleteSubject(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later."});

        expect(mockFindUnique).toHaveBeenCalledWith({where:{id:1}});
        expect(mockDelete).not.toHaveBeenCalled()
    })

    test("should return 500 when deleting a subject failed",async()=>{
        mockFindUnique.mockResolvedValue(true);

        mockDelete.mockRejectedValue(new Error("Subject deletion failed"));

        await deleteSubject(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later."});

        expect(mockFindUnique).toHaveBeenCalledWith({where:{id:1}});
        expect(mockDelete).toHaveBeenCalledWith({where:{id:1}});


    })
})