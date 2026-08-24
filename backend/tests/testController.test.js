const mockFindFirst = jest.fn();
const mockCreate = jest.fn();
const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();
const mockUpdate = jest.fn();
const mockMarkFindMany = jest.fn();
const mockDelete = jest.fn();
const mockStudentFindMany = jest.fn();
const mockMarkCreate = jest.fn();
const mockMarkUpdate = jest.fn();
const mockMarkFindFirst = jest.fn();

const mockPrisma = {

    test:{
        create:mockCreate,
        findFirst:mockFindFirst,
        findMany:mockFindMany,
        findUnique:mockFindUnique,
        update:mockUpdate,
        delete:mockDelete
    },
    mark:{
        findMany:mockMarkFindMany,
        create:mockMarkCreate,
        update:mockMarkUpdate,
        findFirst:mockMarkFindFirst
    },
    student:{
        findMany:mockStudentFindMany
    }
}

jest.mock("../prisma/prisma",()=>{
    return mockPrisma
})

const { createTest, getTests, getoneTest, updateTest,deleteTest,getStudentByTest ,storeMarks,viewMarks,updateMarks} = require("../controllers/testController");
let req,res;

describe("create test controller",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
        req={
            body:{
                name:"Maths test",
                class_id:1,
                subject_id:1,
                test_date:new Date("2026-08-19")
            }
        }

        res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        }
    })

    test("should return 422 when mandatory fields are empty",async()=>{
        req.body.name="";
        req.body.class_id="";
        req.body.subject_id="";
        req.body.test_date="";

        await createTest(req,res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({error:"Please enter the required fields"});

        expect(mockFindFirst).not.toHaveBeenCalled();
        expect(mockCreate).not.toHaveBeenCalled();
    })

    test("should return 422 when name is empty",async()=>{
        req.body.name="";

        await createTest(req,res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({error:"Please enter the required fields"});

        expect(mockFindFirst).not.toHaveBeenCalled();
        expect(mockCreate).not.toHaveBeenCalled();
    })

    test("should return 422 when class Id is empty",async()=>{

        req.body.class_id="";

        await createTest(req,res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({error:"Please enter the required fields"});

        expect(mockFindFirst).not.toHaveBeenCalled();
        expect(mockCreate).not.toHaveBeenCalled();
    })

    test("should return 422 when subject Id empty",async()=>{

        req.body.subject_id="";

        await createTest(req,res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({error:"Please enter the required fields"});

        expect(mockFindFirst).not.toHaveBeenCalled();
        expect(mockCreate).not.toHaveBeenCalled();
    })

    test("should return 422 when test date is empty",async()=>{

        req.body.test_date="";

        await createTest(req,res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({error:"Please enter the required fields"});

        expect(mockFindFirst).not.toHaveBeenCalled();
        expect(mockCreate).not.toHaveBeenCalled();
    })

    test("should return 409 when test already exists",async()=>{
        mockFindFirst.mockResolvedValue(true);

        await createTest(req,res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({error:"Test already exists"});

        expect(mockFindFirst).toHaveBeenCalledWith({
            where:{
                name:"Maths test",
                classId:1,
                subjectId:1,
                testDate:new Date("2026-08-19")
            }
        });

        expect(mockCreate).not.toHaveBeenCalled();
    })

    test("should return 201 when test created successfully",async()=>{
        mockFindFirst.mockResolvedValue(null);

        mockCreate.mockResolvedValue({
            name:"Maths test",
            id:1,
            classId:1,
            subjectId:1,
            testDate:new Date("2026-08-19")
        });

        await createTest(req,res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            data:{
                id:1,
                name:"Maths test",
                classId:1,
                subjectId:1,
                testDate:new Date("2026-08-19")

            },message:"Test created successfully"
        });

        expect(mockFindFirst).toHaveBeenCalledWith({
            where:{
                name:"Maths test",
                classId:1,
                subjectId:1,
                testDate:new Date("2026-08-19")
            }
        })

        expect(mockCreate).toHaveBeenCalledWith({
            data:{
                name:"Maths test",
                classId:1,
                subjectId:1,
                testDate:new Date("2026-08-19")
            }
        })

    })

    test("should return 500 when finding test fails",async()=>{
        mockFindFirst.mockRejectedValue(new Error("Error,finding test failed"));

        await createTest(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockFindFirst).toHaveBeenCalledWith({
            where:{
                name:"Maths test",
                classId:1,
                subjectId:1,
                testDate:new Date("2026-08-19")
            }
        })

        expect(mockCreate).not.toHaveBeenCalled()
    })

    test("should return 500 when test creation fails",async()=>{
        mockFindFirst.mockResolvedValue(null);
        mockCreate.mockRejectedValue(new Error("Error, test creation failed"));

        await createTest(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockFindFirst).toHaveBeenCalledWith({
            where:{
                name:"Maths test",
                classId:1,
                subjectId:1,
                testDate:new Date("2026-08-19")
            }
        })

        expect(mockCreate).toHaveBeenCalledWith({
            data:{
                name:"Maths test",
                classId:1,
                subjectId:1,
                testDate:new Date("2026-08-19")
            }
        })
    })

})

describe("Get tests controller",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();

        res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        }
    })

    test("should return 200 when fetching test successfully",async()=>{
        mockFindMany.mockResolvedValue([{
            id:1,
            name:"Maths test",
            classId:1,
            subjectId:1,
            testDate:"2026-08-19"
        },{
            id:2,
            name:"Science test",
            classId:1,
            subjectId:2,
            testDate:"2026-08-20"
        }
    ])

    await getTests(req,res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{
            id:1,
            name:"Maths test",
            classId:1,
            subjectId:1,
            testDate:"2026-08-19"
        },{
            id:2,
            name:"Science test",
            classId:1,
            subjectId:2,
            testDate:"2026-08-20"
        }
    ]);

    expect(mockFindMany).toHaveBeenCalledWith({
        include:{
            subject:true,
            class:{
                include:{
                    standard:true
                }
            }
        }
    })
    })

    test("should return 500 when fetching test fails",async()=>{
        mockFindMany.mockRejectedValue(new Error("Error,fetching test data failed"));

        await getTests(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

        expect(mockFindMany).toHaveBeenCalledWith({
            include:{
                subject:true,
                class:{
                    include:{
                        standard:true
                    }
                }
            }
        })
    })
})

describe("Get single test controller",()=>{
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

    test("should return 404 when test not found",async()=>{
        mockFindUnique.mockResolvedValue(null);

        await getoneTest(req,res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error:"Test not found"});
        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            },
            include:{
                subject:true,
                class:{
                    include:{
                        standard:true
                    }
                }
            }
        })
    })

        test("should return 200 when fetching test data successfully",async()=>{
            mockFindUnique.mockResolvedValue({
                id:1,
                name:"Maths test",
                classId:1,
                subjectId:1,
                testDate:"2026-08-19"
            })

            await getoneTest(req,res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                id:1,
                name:"Maths test",
                classId:1,
                subjectId:1,
                testDate:"2026-08-19"
            })

            expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            },
            include:{
                subject:true,
                class:{
                    include:{
                        standard:true
                    }
                }
            }
        })

        })

        test("should return 500 when fetching test fails",async()=>{
            mockFindUnique.mockRejectedValue(new Error("Failed to fetch test data"));

            await getoneTest(req,res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({error:"Something went wrong. Please try again later"});

            expect(mockFindUnique).toHaveBeenCalledWith({
            where:{
                id:1
            },
            include:{
                subject:true,
                class:{
                    include:{
                        standard:true
                    }
                }
            }
        })

        })
 })

 describe("update test controller",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();

        req={
            params:{
                id:1
            },
            body:{
                name:"Maths test",
                classId:1,
                subjectId:1,
                testDate:"2026-08-20"
            }
        }
        res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        }
    })

    test("should return 404 when test not found",async()=>{
        mockFindUnique.mockResolvedValue(null);

        await updateTest(req,res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error:"Test not found"});

        expect(mockFindUnique).toHaveBeenCalledWith({where:{
            id:1
        }});

        expect(mockFindFirst).not.toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();
        expect(mockMarkFindMany).not.toHaveBeenCalled();
    })

    test("should return 409 when test already exists",async()=>{
        mockFindUnique.mockResolvedValue({
            id:1,
            name:"Science Test",
            classId:1,
            subjectId:1,
            testDate:"2026-08-20"
        });
        mockFindFirst.mockResolvedValue(true);

        await updateTest(req,res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({error:"Test already exists"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where:{id:1}
        })

        expect(mockFindFirst).toHaveBeenCalledWith({
            where:{
                name:"Maths test",
                classId:1,
                subjectId:1,
                testDate:new Date("2026-08-20"),
                id:{
                    not:1
                }
            }
        })

        expect(mockMarkFindMany).not.toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();

    })

    test("should return 409 when marks are already entered and class is changed", async () => {

        req.body.classId = 2;
    mockFindUnique.mockResolvedValue({
        id: 1,
        name: "Science Test",
        classId: 1,
        subjectId: 1,
        testDate: new Date("2026-08-20")
    });


    mockFindFirst.mockResolvedValue(null);

  
    mockMarkFindMany.mockResolvedValue([
        {
            id: 1,
            testId: 1
        }
    ]);

    await updateTest(req, res);

    expect(res.status).toHaveBeenCalledWith(409);

    expect(res.json).toHaveBeenCalledWith({
        error: "Cannot change class. Marks have already been entered for this test."
    });


    expect(mockFindUnique).toHaveBeenCalledWith({
        where: {
            id: 1
        }
    });

    expect(mockFindFirst).toHaveBeenCalledWith({
        where: {
            name: "Maths test",
            classId: 2,
            subjectId: 1,
            testDate: new Date("2026-08-20"),
            id: {
                not: 1
            }
        }
    });

    expect(mockMarkFindMany).toHaveBeenCalledWith({
        where: {
            testId: 1
        }
    });

    expect(mockUpdate).not.toHaveBeenCalled();
})

test("should return 200 when test updated successfully", async () => {

    mockFindUnique.mockResolvedValue({
        id: 1,
        name: "Science Test",
        classId: 1,
        subjectId: 1,
        testDate: new Date("2026-08-20")
    });

    mockFindFirst.mockResolvedValue(null);

    mockMarkFindMany.mockResolvedValue([]);

    mockUpdate.mockResolvedValue({
        id: 1,
        name: "Maths test",
        classId: 1,
        subjectId: 1,
        testDate: new Date("2026-08-20")
    });

    await updateTest(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
        message: "Test updated successfully"
    });

    expect(mockFindUnique).toHaveBeenCalledWith({
        where: {
            id: 1
        }
    });

    expect(mockFindFirst).toHaveBeenCalledWith({
        where: {
            name: "Maths test",
            classId: 1,
            subjectId: 1,
            testDate: new Date("2026-08-20"),
            id: {
                not: 1
            }
        }
    });

    expect(mockMarkFindMany).toHaveBeenCalledWith({
        where: {
            testId: 1
        }
    });

    expect(mockUpdate).toHaveBeenCalledWith({
        where: {
            id: 1
        },
        data: {
            name: "Maths test",
            classId: 1,
            subjectId: 1,
            testDate: new Date("2026-08-20")
        }
    })
})

test("should return 500 when finding existing test fails", async () => {

    mockFindUnique.mockRejectedValue(
        new Error("Error finding existing test")
    );

    await updateTest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
        error: "Something went wrong. Please try again later"
    });

    expect(mockFindUnique).toHaveBeenCalledWith({
        where: {
            id: 1
        }
    });

    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockMarkFindMany).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
})

test("should return 500 when checking existing test fails", async () => {

    mockFindUnique.mockResolvedValue({
        id: 1,
        name: "Science Test",
        classId: 1,
        subjectId: 1,
        testDate: new Date("2026-08-20")
    });

    mockFindFirst.mockRejectedValue(
        new Error("Error checking existing test")
    );

    await updateTest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
        error: "Something went wrong. Please try again later"
    });

    expect(mockFindUnique).toHaveBeenCalledWith({
        where: {
            id: 1
        }
    });

    expect(mockFindFirst).toHaveBeenCalledWith({
        where: {
            name: "Maths test",
            classId: 1,
            subjectId: 1,
            testDate: new Date("2026-08-20"),
            id: {
                not: 1
            }
        }
    });

    expect(mockMarkFindMany).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
})

test("should return 500 when checking marks fails", async () => {

    mockFindUnique.mockResolvedValue({
        id: 1,
        name: "Science Test",
        classId: 1,
        subjectId: 1,
        testDate: new Date("2026-08-20")
    });

    mockFindFirst.mockResolvedValue(null);

    mockMarkFindMany.mockRejectedValue(
        new Error("Error checking marks")
    );

    await updateTest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
        error: "Something went wrong. Please try again later"
    });

    expect(mockFindUnique).toHaveBeenCalledWith({
        where: {
            id: 1
        }
    });

    expect(mockFindFirst).toHaveBeenCalled();

    expect(mockMarkFindMany).toHaveBeenCalledWith({
        where: {
            testId: 1
        }
    });

    expect(mockUpdate).not.toHaveBeenCalled();
})

test("should return 500 when test update fails", async () => {

    mockFindUnique.mockResolvedValue({
        id: 1,
        name: "Science Test",
        classId: 1,
        subjectId: 1,
        testDate: new Date("2026-08-20")
    });

    mockFindFirst.mockResolvedValue(null);

    mockMarkFindMany.mockResolvedValue([]);

    mockUpdate.mockRejectedValue(
        new Error("Test update failed")
    );

    await updateTest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
        error: "Something went wrong. Please try again later"
    });

    expect(mockFindUnique).toHaveBeenCalledWith({
        where: {
            id: 1
        }
    });

    expect(mockFindFirst).toHaveBeenCalled();

    expect(mockMarkFindMany).toHaveBeenCalledWith({
        where: {
            testId: 1
        }
    });

    expect(mockUpdate).toHaveBeenCalled();

})
 })

 describe("Delete test controller", () => {

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            params: {
                id: 1
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    })


    test("should return 404 when test not found", async () => {
        mockFindUnique.mockResolvedValue(null);

        await deleteTest(req, res);

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({error: "Test not found"})

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        });

        expect(mockDelete).not.toHaveBeenCalled();
    })


    test("should return 200 when test deleted successfully", async () => {

        mockFindUnique.mockResolvedValue({
            id: 1,
            name: "Maths Test"
        });

        mockDelete.mockResolvedValue({
            id: 1,
            name: "Maths Test"
        });

        await deleteTest(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({message: "Maths Test deleted successfully"})

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        })

        expect(mockDelete).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        })
    })


    test("should return 500 when finding test fails", async () => {

        mockFindUnique.mockRejectedValue(new Error("Finding test failed"));

        await deleteTest(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({error: "Something went wrong. Please try again later"})

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        })

        expect(mockDelete).not.toHaveBeenCalled();
    })


    test("should return 500 when test deletion fails", async () => {

        mockFindUnique.mockResolvedValue({
            id: 1,
            name: "Maths Test"
        });

        mockDelete.mockRejectedValue(new Error("Test deletion failed"));

        await deleteTest(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({error: "Something went wrong. Please try again later"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        })

        expect(mockDelete).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        })
    })

})

describe("Get students by test controller", () => {

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            params: {
                id: 1
            }
        }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    })

    test("should return 404 when test not found", async () => {

        mockFindUnique.mockResolvedValue(null);

        await getStudentByTest(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error: "Test not found"})

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        })
        expect(mockStudentFindMany).not.toHaveBeenCalled();
    })

    test("should return 200 when students fetched successfully", async () => {

        mockFindUnique.mockResolvedValue({
            id: 1,
            classId: 2,
            subjectId:1,
            name:"Maths test"
        });

        mockStudentFindMany.mockResolvedValue([
            {
                id: 1,
                firstName: "Arun",
                lastName: "Kumar",
                classId: 2,
                class: {
                    id: 2,
                    standard: {
                        id: 1,
                        name: "LKG"
                    }
                }
            },
            {
                id: 2,
                firstName: "Janani",
                lastName: "Ram",
                classId: 2,
                class: {
                    id: 2,
                    standard: {
                        id: 1,
                        name: "LKG"
                    }
                }
            }
        ]);

        await getStudentByTest(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith([
            {
                id: 1,
                firstName: "Arun",
                lastName: "Kumar",
                classId: 2,
                class: {
                    id: 2,
                    standard: {
                        id: 1,
                        name: "LKG"
                    }
                }
            },
            {
                id: 2,
                firstName: "Janani",
                lastName: "Ram",
                classId: 2,
                class: {
                    id: 2,
                    standard: {
                        id: 1,
                        name: "LKG"
                    }
                }
            }
        ]);

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        });

        expect(mockStudentFindMany).toHaveBeenCalledWith({
            where: {
                classId: 2
            },
            include: {
                class: {
                    include: {
                        standard: true
                    }
                }
            }
        });
    });


    test("should return 500 when finding test fails", async () => {

        mockFindUnique.mockRejectedValue(
            new Error("Finding test failed")
        );

        await getStudentByTest(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({error: "Something went wrong. Please try again later"})

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        })
        expect(mockStudentFindMany).not.toHaveBeenCalled();
    })

    test("should return 500 when fetching students fails", async () => {

        mockFindUnique.mockResolvedValue({
            id: 1,
            classId: 2
        });

        mockStudentFindMany.mockRejectedValue(new Error("Fetching students failed"));

        await getStudentByTest(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({error: "Something went wrong. Please try again later"})

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        })
        expect(mockStudentFindMany).toHaveBeenCalledWith({
            where: {
                classId: 2
            },
            include: {
                class: {
                    include: {
                        standard: true
                    }
                }
            }
        })
    })

})

describe("store marks controller", () => {

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            params: {
                id: 1
            },
            body: {
                marks: [
                    {
                        student_id: 1,
                        mark: 80
                    },
                    {
                        student_id: 2,
                        mark: 90
                    }
                ]
            }
        }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    })

    test("should return 404 when test not found", async () => {

        mockFindUnique.mockResolvedValue(null);

        await storeMarks(req, res);

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({error: "Test not found"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        })

        expect(mockMarkFindMany).not.toHaveBeenCalled();
        expect(mockMarkCreate).not.toHaveBeenCalled();
    })

    test("should return 409 when marks are already entered", async () => {

        mockFindUnique.mockResolvedValue({
            id: 1,
            name: "Maths Test"
        });

        mockMarkFindMany.mockResolvedValue([
            {
                id: 1,
                testId: 1,
                studentId: 1,
                StdMarks: 80
            }
        ])
        await storeMarks(req, res);

        expect(res.status).toHaveBeenCalledWith(409);

        expect(res.json).toHaveBeenCalledWith({
            error: "Marks already entered for this test"
        });

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        });

        expect(mockMarkFindMany).toHaveBeenCalledWith({
            where: {
                testId: 1
            }
        });

        expect(mockMarkCreate).not.toHaveBeenCalled();
    });

    test("should return 201 when marks added successfully", async () => {

        mockFindUnique.mockResolvedValue({
            id: 1,
            name: "Maths Test"
        });

        mockMarkFindMany.mockResolvedValue([]);

        mockMarkCreate
            .mockResolvedValueOnce({
                id: 1,
                testId: 1,
                studentId: 1,
                StdMarks: 80
            })
            .mockResolvedValueOnce({
                id: 2,
                testId: 1,
                studentId: 2,
                StdMarks: 90
            });

        await storeMarks(req, res);

        expect(res.status).toHaveBeenCalledWith(201);

        expect(res.json).toHaveBeenCalledWith({message: "Marks added successfully"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        })

        expect(mockMarkFindMany).toHaveBeenCalledWith({
            where: {
                testId: 1
            }
        })

        expect(mockMarkCreate).toHaveBeenNthCalledWith(1, {
            data: {
                testId: 1,
                studentId: 1,
                StdMarks: 80
            }
        })

        expect(mockMarkCreate).toHaveBeenNthCalledWith(2, {
            data: {
                testId: 1,
                studentId: 2,
                StdMarks: 90
            }
        })
    })

    test("should return 500 when finding test fails", async () => {
        mockFindUnique.mockRejectedValue(new Error("Finding test failed"));

        await storeMarks(req, res);
        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({error: "Something went wrong. Please try again later"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        })

        expect(mockMarkFindMany).not.toHaveBeenCalled();
        expect(mockMarkCreate).not.toHaveBeenCalled();
    })


    test("should return 500 when checking existing marks fails", async () => {

        mockFindUnique.mockResolvedValue({
            id: 1,
            name: "Maths Test"
        });

        mockMarkFindMany.mockRejectedValue(new Error("Finding marks failed"));

        await storeMarks(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({error: "Something went wrong. Please try again later"});

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        });

        expect(mockMarkFindMany).toHaveBeenCalledWith({
            where: {
                testId: 1
            }
        });

        expect(mockMarkCreate).not.toHaveBeenCalled();
    })


    test("should return 500 when creating mark fails", async () => {

        mockFindUnique.mockResolvedValue({
            id: 1,
            name: "Maths Test"
        })

        mockMarkFindMany.mockResolvedValue([]);

        mockMarkCreate.mockRejectedValue(
            new Error("Creating mark failed")
        );

        await storeMarks(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({error: "Something went wrong. Please try again later"})
        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        })

        expect(mockMarkFindMany).toHaveBeenCalledWith({
            where: {
                testId: 1
            }
        })

        expect(mockMarkCreate).toHaveBeenCalledWith({
            data: {
                testId: 1,
                studentId: 1,
                StdMarks: 80
            }
        })
    })

})

describe("View marks controller", () => {

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            params: {
                id: 1
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    })

    test("should return 404 when test not found", async () => {

        mockFindUnique.mockResolvedValue(null);

        await viewMarks(req, res);

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({ error: "Test not found"})

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        });

        expect(mockMarkFindMany).not.toHaveBeenCalled();
    })

    test("should return 200 when marks fetched successfully", async () => {

        mockFindUnique.mockResolvedValue({
            id: 1,
            classId: 1
        });

        mockMarkFindMany.mockResolvedValue([
            {
                id: 1,
                testId: 1,
                studentId: 1,
                StdMarks: 85,
                student: {
                    id: 1,
                    firstName: "Suba",
                    lastName: "Lakshmi",
                    regNo: "101"
                },
                test: {
                    id: 1,
                    name: "Maths Test",
                    class: {
                        id: 1,
                        standard: {
                            id: 1,
                            name: "LKG"
                        }
                    }
                }
            }
        ]);

        await viewMarks(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith([
            {
                id: 1,
                testId: 1,
                studentId: 1,
                StdMarks: 85,
                student: {
                    id: 1,
                    firstName: "Suba",
                    lastName: "Lakshmi",
                    regNo: "101"
                },
                test: {
                    id: 1,
                    name: "Maths Test",
                    class: {
                        id: 1,
                        standard: {
                            id: 1,
                            name: "LKG"
                        }
                    }
                }
            }
        ]);

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        });

        expect(mockMarkFindMany).toHaveBeenCalledWith({
            where: {
                testId: 1
            },
            include: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        regNo: true
                    }
                },
                test: {
                    include: {
                        class: {
                            include: {
                                standard: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                student: {
                    regNo: "asc"
                }
            }
        });
    })

    test("should return 500 when finding test fails", async () => {

        mockFindUnique.mockRejectedValue(
            new Error("Finding test failed")
        );

        await viewMarks(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: "Something went wrong. Please try again later"
        });

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        });

        expect(mockMarkFindMany).not.toHaveBeenCalled();
    })

    test("should return 500 when fetching marks fails", async () => {

        mockFindUnique.mockResolvedValue({
            id: 1,
            classId: 1
        })

        mockMarkFindMany.mockRejectedValue(new Error("Fetching marks failed"));

        await viewMarks(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: "Something went wrong. Please try again later"
        });

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        });

        expect(mockMarkFindMany).toHaveBeenCalledWith({
            where: {
                testId: 1
            },
            include: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        regNo: true
                    }
                },
                test: {
                    include: {
                        class: {
                            include: {
                                standard: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                student: {
                    regNo: "asc"
                }
          
            }
        })
    })

})

describe("update marks controller", () => {

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            params: {
                id: 1
            },
            body: {
                updateMark: [
                    {
                        studentId: 1,
                        StdMarks: 80
                    }
                ]
            }
        }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    })

    test("should return 404 when test not found", async () => {

        mockFindUnique.mockResolvedValue(null);
        await updateMarks(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error: "Test not found."})
        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        })

        expect(mockMarkFindFirst).not.toHaveBeenCalled();
        expect(mockMarkUpdate).not.toHaveBeenCalled();
    })

    test("should return 404 when mark not found", async () => {

        mockFindUnique.mockResolvedValue({
            id: 1,
            classId: 1
        });

        mockMarkFindFirst.mockResolvedValue(null);

        await updateMarks(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: "Mark not found"})

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        })
        expect(mockMarkFindFirst).toHaveBeenCalledWith({
            where: {
                testId: 1,
                studentId: 1
            }
        })

        expect(mockMarkUpdate).not.toHaveBeenCalled()
    })

    test("should return 200 when marks updated successfully", async () => {

        mockFindUnique.mockResolvedValue({
            id: 1,
            classId: 1
        })

        mockMarkFindFirst.mockResolvedValue({
            id: 10,
            testId: 1,
            studentId: 1,
            StdMarks: 70
        })

        mockMarkUpdate.mockResolvedValue({
            id: 10,
            StdMarks: 80
        })
        await updateMarks(req, res);
        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({message: "Marks updated successfully"})

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        })

        expect(mockMarkFindFirst).toHaveBeenCalledWith({
            where: {
                testId: 1,
                studentId: 1
            }
        })

        expect(mockMarkUpdate).toHaveBeenCalledWith({
            where: {
                id: 10
            },
            data: {
                StdMarks: 80
            }
        })
    })

    test("should return 500 when finding test fails", async () => {

        mockFindUnique.mockRejectedValue(new Error("Finding test failed"))

        await updateMarks(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: "Something went wrong. Please try again later"})

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        })
        expect(mockMarkFindFirst).not.toHaveBeenCalled();
        expect(mockMarkUpdate).not.toHaveBeenCalled();
    })

    test("should return 500 when finding mark fails", async () => {

        mockFindUnique.mockResolvedValue({
            id: 1,
            classId: 1
        })
        mockMarkFindFirst.mockRejectedValue(new Error("Finding mark failed"))
        await updateMarks(req, res);
        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({error: "Something went wrong. Please try again later"})

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        })
        expect(mockMarkFindFirst).toHaveBeenCalledWith({
            where: {
                testId: 1,
                studentId: 1
            }
        })
        expect(mockMarkUpdate).not.toHaveBeenCalled();
    })

    test("should return 500 when updating mark fails", async () => {

        mockFindUnique.mockResolvedValue({
            id: 1,
            classId: 1
        })

        mockMarkFindFirst.mockResolvedValue({
            id: 10,
            testId: 1,
            studentId: 1,
            StdMarks: 70
        });

        mockMarkUpdate.mockRejectedValue(new Error("Updating mark failed"))

        await updateMarks(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: "Something went wrong. Please try again later"})

        expect(mockFindUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        })
        expect(mockMarkFindFirst).toHaveBeenCalledWith({
            where: {
                testId: 1,
                studentId: 1
            }
        })

        expect(mockMarkUpdate).toHaveBeenCalledWith({
            where: {
                id: 10
            },
            data: {
                StdMarks: 80
            }
        })
    })

})