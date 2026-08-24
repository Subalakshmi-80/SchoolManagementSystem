const mockPeriodFindMany = jest.fn();
const mockTimetableFindFirst = jest.fn();
const mockTimetableCreate = jest.fn();
const mockTimetableFindMany = jest.fn();
const mockTimetableUpdate = jest.fn();

const mockPrisma = {
    period: {
        findMany: mockPeriodFindMany
    },
    timetable: {
        findFirst: mockTimetableFindFirst,
        create: mockTimetableCreate,
        findMany: mockTimetableFindMany,
        update: mockTimetableUpdate
    }
}

jest.mock("../prisma/prisma", () => {
    return mockPrisma;
})

const {
    getPeriods,
    createTimetable,
    getTimetableByClass,
    updateTimetable
} = require("../controllers/timetableController");

let req,res;

describe("Get periods controller", () => {

    beforeEach(() => {
        jest.clearAllMocks();

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    })

    test("should return 200 when periods fetched successfully", async () => {
        mockPeriodFindMany.mockResolvedValue([
            {
                id: 1,
                periodNo: 1
            },
            {
                id: 2,
                periodNo: 2
            }
        ])
        await getPeriods(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
            {
                id: 1,
                periodNo: 1
            },
            {
                id: 2,
                periodNo: 2
            }
        ])

        expect(mockPeriodFindMany).toHaveBeenCalledWith({
            orderBy: {
                periodNo: "asc"
            }
        })
    })

    test("should return 404 when periods are not found", async () => {

        mockPeriodFindMany.mockResolvedValue([]);

        await getPeriods(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error: "Periods not found."})

        expect(mockPeriodFindMany).toHaveBeenCalledWith({
            orderBy: {
                periodNo: "asc"
            }
        })
    })

    test("should return 500 when fetching periods fails", async () => {

        mockPeriodFindMany.mockRejectedValue(new Error("Fetching periods failed"))
        await getPeriods(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: "Something went wrong. please try again later"})

        expect(mockPeriodFindMany).toHaveBeenCalledWith({
            orderBy: {
                periodNo: "asc"
            }
        })
    })

})

describe("Create timetable controller", () => {

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            body: {
                class_id: 1,
                day: "Monday",
                period_id: 1,
                subject_id: 2
            }
        }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    })

    test("should return 409 when period already allocated", async () => {

        mockTimetableFindFirst.mockResolvedValue({
            id: 1,
            classId: 1,
            day: "Monday",
            periodId: 1
        })

        await createTimetable(req, res);
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({error: "Period allocated already for this class"})

        expect(mockTimetableFindFirst).toHaveBeenCalledWith({
            where: {
                classId: 1,
                day: "Monday",
                periodId: 1
            }
        })

        expect(mockTimetableCreate).not.toHaveBeenCalled();
    })

    test("should return 201 when timetable created successfully", async () => {
        mockTimetableFindFirst.mockResolvedValue(null);

        mockTimetableCreate.mockResolvedValue({
            id: 1,
            periodId: 1,
            day: "Monday",
            classId: 1,
            subjectId: 2
        });

        await createTimetable(req, res);

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({message: "Successfully created"})

        expect(mockTimetableFindFirst).toHaveBeenCalledWith({
            where: {
                classId: 1,
                day: "Monday",
                periodId: 1
            }
        })

        expect(mockTimetableCreate).toHaveBeenCalledWith({
            data: {
                periodId: 1,
                day: "Monday",
                classId: 1,
                subjectId: 2
            }
        })
    })

    test("should return 500 when checking existing period fails", async () => {

        mockTimetableFindFirst.mockRejectedValue(new Error("Finding timetable failed"))

        await createTimetable(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: "Something went wrong. Please try again later."})

        expect(mockTimetableCreate).not.toHaveBeenCalled();
    })

    test("should return 500 when timetable creation fails", async () => {

        mockTimetableFindFirst.mockResolvedValue(null);
        mockTimetableCreate.mockRejectedValue(new Error("Timetable creation failed"))

        await createTimetable(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: "Something went wrong. Please try again later."})

        expect(mockTimetableCreate).toHaveBeenCalledWith({
            data: {
                periodId: 1,
                day: "Monday",
                classId: 1,
                subjectId: 2
            }
        })
    })

})

describe("Get timetable by class controller", () => {

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            params: {
                id: 1
            },
            query: {
                day: "Monday"
            }
        }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    })

    test("should return 200 when timetable fetched successfully", async () => {

        mockTimetableFindMany.mockResolvedValue([ {
                id: 1,
                classId: 1,
                day: "Monday",
                periodId: 1,
                subjectId: 2
            },{
                id: 2,
                classId: 1,
                day: "Monday",
                periodId: 2,
                subjectId: 3
            }
        ])

        await getTimetableByClass(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            [ {
                id: 1,
                classId: 1,
                day: "Monday",
                periodId: 1,
                subjectId: 2
            },{
                id: 2,
                classId: 1,
                day: "Monday",
                periodId: 2,
                subjectId: 3
            }
        ]
        );

        expect(mockTimetableFindMany).toHaveBeenCalledWith({
            where: {
                classId: 1,
                day: "Monday"
            },
            include: {
                class: {
                    include: {
                        standard: true
                    }
                },
                period: true,
                subject: true
            },
            orderBy: [
                {
                    day: "asc"
                },
                {
                    periodId: "asc"
                }
            ]
        })
    })

    test("should return 500 when fetching timetable fails", async () => {

        mockTimetableFindMany.mockRejectedValue(new Error("Fetching timetable failed"))

        await getTimetableByClass(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: "Something went wrong. Please try again later"})

        expect(mockTimetableFindMany).toHaveBeenCalledWith({
            where: {
                classId: 1,
                day: "Monday"
            },
            include: {
                class: {
                    include: {
                        standard: true
                    }
                },
                period: true,
                subject: true
            },
            orderBy: [
                {
                    day: "asc"
                },
                {
                    periodId: "asc"
                }
            ]
        })
    })

})

describe("Update timetable controller", () => {

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            body: {
                classId: 1,
                periodId: 1,
                day: "Monday",
                subjectId: 2
            }
        }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    })

    test("should return 404 when timetable not found", async () => {

        mockTimetableFindFirst.mockResolvedValue(null);

        await updateTimetable(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error: "Timetable not found"})

        expect(mockTimetableFindFirst).toHaveBeenCalledWith({
            where: {
                classId: 1,
                periodId: 1,
                day: "Monday"
            }
        })
        expect(mockTimetableUpdate).not.toHaveBeenCalled();
    })

    test("should return 200 when timetable updated successfully", async () => {

        mockTimetableFindFirst.mockResolvedValue({
            id: 10,
            classId: 1,
            periodId: 1,
            day: "Monday",
            subjectId: 1
        })
        mockTimetableUpdate.mockResolvedValue({
            id: 10,
            subjectId: 2
        })

        await updateTimetable(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Updated successfully"})

        expect(mockTimetableFindFirst).toHaveBeenCalledWith({
            where: {
                classId: 1,
                periodId: 1,
                day: "Monday"
            }
        })

        expect(mockTimetableUpdate).toHaveBeenCalledWith({
            where: {
                id: 10
            },
            data: {
                subjectId: 2
            }
        })
    })

    test("should return 500 when finding timetable fails", async () => {

        mockTimetableFindFirst.mockRejectedValue(new Error("Finding timetable failed"))

        await updateTimetable(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: "Something went wrong. Please try again later"})

        expect(mockTimetableFindFirst).toHaveBeenCalledWith({
            where: {
                classId: 1,
                periodId: 1,
                day: "Monday"
            }
        })
        expect(mockTimetableUpdate).not.toHaveBeenCalled();
    })

    test("should return 500 when updating timetable fails", async () => {
        mockTimetableFindFirst.mockResolvedValue({
            id: 10,
            classId: 1,
            periodId: 1,
            day: "Monday",
            subjectId: 1
        })
        mockTimetableUpdate.mockRejectedValue(new Error("Updating timetable failed"))

        await updateTimetable(req, res)
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: "Something went wrong. Please try again later"})

        expect(mockTimetableUpdate).toHaveBeenCalledWith({
            where: {
                id: 10
            },
            data: {
                subjectId: 2
            }
        })
    })

})