const mockPeriodFindMany = jest.fn();
const mockTimetableFindFirst = jest.fn();
const mockTimetableCreate = jest.fn();
const mockTimetableFindMany = jest.fn();
const mockTimetableUpdate = jest.fn();
const mockTransaction = jest.fn();

const mockTx = {
    timetable: {
        findFirst: mockTimetableFindFirst,
        create: mockTimetableCreate,
        update: mockTimetableUpdate
    }
};

const mockPrisma = {
    period: {
        findMany: mockPeriodFindMany
    },

    timetable: {
        findFirst: mockTimetableFindFirst,
        create: mockTimetableCreate,
        findMany: mockTimetableFindMany,
        update: mockTimetableUpdate
    },

    $transaction: mockTransaction
};

jest.mock("../prisma/prisma", () => {
    return mockPrisma;
});

const {
    getPeriods,
    createTimetable,
    getTimetableByClass,
    updateTimetable
} = require("../controllers/timetableController");

let req, res;


/* =========================================================
   GET PERIODS
========================================================= */

describe("Get periods controller", () => {

    beforeEach(() => {

        jest.clearAllMocks();

        req = {};

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });


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
        ]);

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
        ]);

        expect(mockPeriodFindMany).toHaveBeenCalledWith({
            orderBy: {
                periodNo: "asc"
            }
        });
    });


    test("should return 404 when periods are not found", async () => {

        mockPeriodFindMany.mockResolvedValue([]);

        await getPeriods(req, res);

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({
            error: "Periods not found."
        });

        expect(mockPeriodFindMany).toHaveBeenCalledWith({
            orderBy: {
                periodNo: "asc"
            }
        });
    });


    test("should return 500 when fetching periods fails", async () => {

        mockPeriodFindMany.mockRejectedValue(
            new Error("Fetching periods failed")
        );

        await getPeriods(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: "Something went wrong. please try again later"
        });

        expect(mockPeriodFindMany).toHaveBeenCalledWith({
            orderBy: {
                periodNo: "asc"
            }
        });
    });

});


/* =========================================================
   CREATE TIMETABLE
========================================================= */

describe("Create timetable controller", () => {

    beforeEach(() => {

        jest.clearAllMocks();

        req = {
            body: {
                class_id: 1,

                timetable: [
                    {
                        day: "Monday",
                        period_id: 1,
                        subject_id: 2
                    },
                    {
                        day: "Monday",
                        period_id: 2,
                        subject_id: 3
                    }
                ]
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        /*
        Make $transaction execute the callback
        with mockTx.
        */
        mockTransaction.mockImplementation(async (callback) => {
            return await callback(mockTx);
        });
    });


    test("should return 400 when class and timetable are required", async () => {

        req.body.class_id = "";
        req.body.timetable = [];

        await createTimetable(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            error: "Class and timetable are required"
        });

        expect(mockTransaction).not.toHaveBeenCalled();

        expect(mockTimetableFindFirst).not.toHaveBeenCalled();

        expect(mockTimetableCreate).not.toHaveBeenCalled();
    });


    test("should return 400 when timetable item fields are missing", async () => {

        req.body.timetable[0].subject_id = "";

        await createTimetable(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            error: "Day,Period and Subject are required"
        });

        expect(mockTransaction).not.toHaveBeenCalled();

        expect(mockTimetableFindFirst).not.toHaveBeenCalled();

        expect(mockTimetableCreate).not.toHaveBeenCalled();
    });


    test("should return 409 when period already allocated", async () => {

        mockTimetableFindFirst.mockResolvedValue({
            id: 1,
            classId: 1,
            day: "Monday",
            periodId: 1
        });

        await createTimetable(req, res);

        expect(res.status).toHaveBeenCalledWith(409);

        expect(res.json).toHaveBeenCalledWith({
            error: "Period 1 already allocated for Monday"
        });

        expect(mockTimetableFindFirst).toHaveBeenCalledWith({
            where: {
                classId: 1,
                day: "Monday",
                periodId: 1
            }
        });

        expect(mockTimetableCreate).not.toHaveBeenCalled();
    });


    test("should return 201 when timetable created successfully", async () => {

        mockTimetableFindFirst
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(null);

        mockTimetableCreate
            .mockResolvedValueOnce({
                id: 1,
                periodId: 1,
                day: "Monday",
                classId: 1,
                subjectId: 2
            })
            .mockResolvedValueOnce({
                id: 2,
                periodId: 2,
                day: "Monday",
                classId: 1,
                subjectId: 3
            });

        await createTimetable(req, res);

        expect(res.status).toHaveBeenCalledWith(201);

        expect(res.json).toHaveBeenCalledWith({
            message: "Timetable created successfully"
        });

        expect(mockTransaction).toHaveBeenCalled();

        expect(mockTimetableFindFirst).toHaveBeenNthCalledWith(1, {
            where: {
                classId: 1,
                day: "Monday",
                periodId: 1
            }
        });

        expect(mockTimetableFindFirst).toHaveBeenNthCalledWith(2, {
            where: {
                classId: 1,
                day: "Monday",
                periodId: 2
            }
        });

        expect(mockTimetableCreate).toHaveBeenNthCalledWith(1, {
            data: {
                classId: 1,
                day: "Monday",
                periodId: 1,
                subjectId: 2
            }
        });

        expect(mockTimetableCreate).toHaveBeenNthCalledWith(2, {
            data: {
                classId: 1,
                day: "Monday",
                periodId: 2,
                subjectId: 3
            }
        });
    });


    test("should return 500 when checking existing period fails", async () => {

        mockTimetableFindFirst.mockRejectedValue(
            new Error("Finding timetable failed")
        );

        await createTimetable(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: "Something went wrong. Please try again later."
        });

        expect(mockTimetableCreate).not.toHaveBeenCalled();
    });


    test("should return 500 when timetable creation fails", async () => {

        mockTimetableFindFirst.mockResolvedValue(null);

        mockTimetableCreate.mockRejectedValue(
            new Error("Timetable creation failed")
        );

        await createTimetable(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: "Something went wrong. Please try again later."
        });

        expect(mockTimetableCreate).toHaveBeenCalledWith({
            data: {
                classId: 1,
                day: "Monday",
                periodId: 1,
                subjectId: 2
            }
        });
    });

});


/* =========================================================
   GET TIMETABLE BY CLASS
========================================================= */

describe("Get timetable by class controller", () => {

    beforeEach(() => {

        jest.clearAllMocks();

        req = {
            params: {
                id: 1
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });


    test("should return 200 when timetable fetched successfully", async () => {

        mockTimetableFindMany.mockResolvedValue([
            {
                id: 1,
                classId: 1,
                day: "Monday",
                periodId: 1,
                subjectId: 2
            },
            {
                id: 2,
                classId: 1,
                day: "Monday",
                periodId: 2,
                subjectId: 3
            }
        ]);

        await getTimetableByClass(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith([
            {
                id: 1,
                classId: 1,
                day: "Monday",
                periodId: 1,
                subjectId: 2
            },
            {
                id: 2,
                classId: 1,
                day: "Monday",
                periodId: 2,
                subjectId: 3
            }
        ]);

        expect(mockTimetableFindMany).toHaveBeenCalledWith({
            where: {
                classId: 1
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
                    periodId: "asc"
                }
            ]
        });
    });


    test("should return 500 when fetching timetable fails", async () => {

        mockTimetableFindMany.mockRejectedValue(
            new Error("Fetching timetable failed")
        );

        await getTimetableByClass(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: "Something went wrong. Please try again later"
        });

        expect(mockTimetableFindMany).toHaveBeenCalledWith({
            where: {
                classId: 1
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
                    periodId: "asc"
                }
            ]
        });
    });

});


/* =========================================================
   UPDATE TIMETABLE - BULK
========================================================= */

describe("Update timetable controller", () => {

    beforeEach(() => {

        jest.clearAllMocks();

        req = {
            body: {
                class_id: 1,

                timetable: [
                    {
                        day: "Monday",
                        period_id: 1,
                        subject_id: 2
                    },
                    {
                        day: "Monday",
                        period_id: 2,
                        subject_id: 3
                    }
                ]
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        /*
        Execute transaction callback
        using mockTx.
        */
        mockTransaction.mockImplementation(async (callback) => {
            return await callback(mockTx);
        });
    });


    test("should return 400 when class and timetable are required", async () => {

        req.body.class_id = "";
        req.body.timetable = [];

        await updateTimetable(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            error: "Class and timetable are required"
        });

        expect(mockTransaction).not.toHaveBeenCalled();

        expect(mockTimetableFindFirst).not.toHaveBeenCalled();

        expect(mockTimetableUpdate).not.toHaveBeenCalled();
    });


    test("should return 400 when day, period or subject is missing", async () => {

        req.body.timetable[0].subject_id = "";

        await updateTimetable(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            error: "Day,Period and subject are required"
        });

        expect(mockTransaction).not.toHaveBeenCalled();

        expect(mockTimetableFindFirst).not.toHaveBeenCalled();

        expect(mockTimetableUpdate).not.toHaveBeenCalled();
    });


    test("should return 404 when timetable is not found", async () => {

        mockTimetableFindFirst.mockResolvedValue(null);

        await updateTimetable(req, res);

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({
            error: "Timetable not found for Monday 1"
        });

        expect(mockTimetableFindFirst).toHaveBeenCalledWith({
            where: {
                day: "Monday",
                periodId: 1,
                classId: 1
            }
        });

        expect(mockTimetableUpdate).not.toHaveBeenCalled();
    });


    test("should return 200 when timetable updated successfully", async () => {

        mockTimetableFindFirst
            .mockResolvedValueOnce({
                id: 10,
                classId: 1,
                day: "Monday",
                periodId: 1,
                subjectId: 1
            })
            .mockResolvedValueOnce({
                id: 11,
                classId: 1,
                day: "Monday",
                periodId: 2,
                subjectId: 1
            });

        mockTimetableUpdate
            .mockResolvedValueOnce({
                id: 10,
                subjectId: 2
            })
            .mockResolvedValueOnce({
                id: 11,
                subjectId: 3
            });

        await updateTimetable(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            message: "Timetable updated successfully"
        });

        expect(mockTransaction).toHaveBeenCalled();

        expect(mockTimetableFindFirst).toHaveBeenNthCalledWith(1, {
            where: {
                day: "Monday",
                periodId: 1,
                classId: 1
            }
        });

        expect(mockTimetableFindFirst).toHaveBeenNthCalledWith(2, {
            where: {
                day: "Monday",
                periodId: 2,
                classId: 1
            }
        });

        expect(mockTimetableUpdate).toHaveBeenNthCalledWith(1, {
            where: {
                id: 10
            },

            data: {
                subjectId: 2
            }
        });

        expect(mockTimetableUpdate).toHaveBeenNthCalledWith(2, {
            where: {
                id: 11
            },

            data: {
                subjectId: 3
            }
        });
    });


    test("should return 500 when finding timetable fails", async () => {

        mockTimetableFindFirst.mockRejectedValue(
            new Error("Finding timetable failed")
        );

        await updateTimetable(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: "Something went wrong. Please try again later"
        });

        expect(mockTimetableUpdate).not.toHaveBeenCalled();
    });


    test("should return 500 when updating timetable fails", async () => {

        mockTimetableFindFirst
            .mockResolvedValueOnce({
                id: 10,
                classId: 1,
                day: "Monday",
                periodId: 1,
                subjectId: 1
            })
            .mockResolvedValueOnce({
                id: 11,
                classId: 1,
                day: "Monday",
                periodId: 2,
                subjectId: 1
            });

        mockTimetableUpdate.mockRejectedValue(
            new Error("Updating timetable failed")
        );

        await updateTimetable(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: "Something went wrong. Please try again later"
        });

        expect(mockTimetableUpdate).toHaveBeenCalledWith({
            where: {
                id: 10
            },

            data: {
                subjectId: 2
            }
        });
    });

});