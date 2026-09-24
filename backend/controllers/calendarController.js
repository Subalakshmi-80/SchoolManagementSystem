const prisma = require("../prisma/prisma");


const crypto = require("crypto");

const createHoliday = async(req,res)=>{
    const {from_date,to_date,reason,academicYearId} = req.body;

    if(!from_date || !to_date || !reason){
        return res.status(422).json({
            error:"From date, to date and reason are required."
        })
    }

    const fromDate = new Date(from_date);
    const toDate = new Date(to_date);

    if(isNaN(fromDate.getTime()) || isNaN(toDate.getTime())){
        return res.status(422).json({
            error:"Invalid date."
        })
    }

    if(fromDate > toDate){
        return res.status(422).json({
            error:"From date cannot be after to date."
        })
    }

    try{

        let selectedAcademicYear;

        if(academicYearId){

            selectedAcademicYear = await prisma.academicYear.findUnique({
                where:{
                    id:Number(academicYearId)
                }
            });

            if(!selectedAcademicYear){
                return res.status(404).json({
                    error:"Academic Year not found."
                })
            }

        }else{

            selectedAcademicYear = await prisma.academicYear.findFirst({
                where:{
                    isActive:true
                }
            });

            if(!selectedAcademicYear){
                return res.status(404).json({
                    error:"Active Academic Year not found."
                })
            }
        }

        if(
            fromDate < selectedAcademicYear.startDate ||
            toDate > selectedAcademicYear.endDate
        ){
            return res.status(422).json({
                error:"Holiday dates must be within the selected Academic Year."
            })
        }

        const dates = [];

        const currentDate = new Date(fromDate);

        while(currentDate <= toDate){
            dates.push(new Date(currentDate))
            currentDate.setDate(currentDate.getDate()+1)
        }

        const existingDates = await prisma.schoolCalendar.findMany({
            where:{
                date:{
                    in:dates
                },
                academicYearId:selectedAcademicYear.id
            },
            select:{
                date:true
            }
        })

        if(existingDates.length > 0){

            const duplicateDates = existingDates.map((item)=>{
                return item.date.toISOString().split("T")[0]
            })

            return res.status(422).json({
                error:"Holiday already exists for these dates.",
                dates:duplicateDates
            })
        }

        const holidayGroupId = crypto.randomUUID();

        const result = await prisma.$transaction(async(tx)=>{
            return Promise.all(
                dates.map((date)=>{
                    return tx.schoolCalendar.create({
                        data:{
                            date:date,
                            type:"HOLIDAY",
                            holidayGroupId:holidayGroupId,
                            reason:reason,
                            createdBy:req.user.id,
                            academicYearId:selectedAcademicYear.id
                        }
                    })
                })
            )
        })

        return res.status(201).json({
            message:"Holiday created successfully.",
            holidays:result
        })

    }catch(error){
        console.log(error);

        return res.status(500).json({
            error:"Something went wrong. Please try again later."
        })
    }
}


const getHolidays = async(req,res) =>{
    const { academicYearId } = req.query;

    try{

        let selectedAcademicYear;

        if(academicYearId){

            selectedAcademicYear = await prisma.academicYear.findUnique({
                where:{
                    id:Number(academicYearId)
                }
            });

            if(!selectedAcademicYear){
                return res.status(404).json({
                    error:"Academic Year not found."
                })
            }

        }else{

            selectedAcademicYear = await prisma.academicYear.findFirst({
                where:{
                    isActive:true
                }
            });

            if(!selectedAcademicYear){
                return res.status(404).json({
                    error:"Active Academic Year not found."
                })
            }
        }

        const holidays = await prisma.schoolCalendar.findMany({
            where:{
                type:"HOLIDAY",
                academicYearId:selectedAcademicYear.id
            },
            orderBy:{
                date:"asc"
            }
        });

        const groupedHolidays = Object.values(
            holidays.reduce((groups,holiday)=>{
                const groupId = holiday.holidayGroupId;

                if(!groups[groupId]){
                    groups[groupId]={
                        groupId:groupId,
                        from_date:holiday.date,
                        to_date:holiday.date,
                        reason:holiday.reason
                    }
                }else{
                    groups[groupId].to_date = holiday.date
                }

                return groups
            },{})
        )

        return res.status(200).json({
            holidays:groupedHolidays
        })

    }catch(error){
        console.log(error);

        return res.status(500).json({
            error:"Something went wrong. Please try again later."
        })
    }
}


const getHolidayByGroupId = async (req, res) => {
    const { groupId } = req.params;
    const { academicYearId } = req.query;

    try {

        let selectedAcademicYear;

        if (academicYearId) {

            selectedAcademicYear = await prisma.academicYear.findUnique({
                where: {
                    id: Number(academicYearId)
                }
            });

            if (!selectedAcademicYear) {
                return res.status(404).json({
                    error: "Academic Year not found."
                });
            }

        } else {

            selectedAcademicYear = await prisma.academicYear.findFirst({
                where: {
                    isActive: true
                }
            });

            if (!selectedAcademicYear) {
                return res.status(404).json({
                    error: "Active Academic Year not found."
                });
            }
        }

        const holidays = await prisma.schoolCalendar.findMany({
            where: {
                holidayGroupId: groupId,
                type: "HOLIDAY",
                academicYearId: selectedAcademicYear.id
            },
            orderBy: {
                date: "asc"
            }
        });

        if (holidays.length === 0) {
            return res.status(404).json({
                error: "Holiday not found."
            });
        }

        return res.status(200).json({
            holiday: {
                groupId: groupId,
                from_date: holidays[0].date,
                to_date: holidays[holidays.length - 1].date,
                reason: holidays[0].reason
            }
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: "Something went wrong. Please try again later."
        });
    }
};


const checkCalendarDate = async (req, res) => {

    const { date, academicYearId } = req.query;

    if (!date) {
        return res.status(422).json({
            error: "Date is required."
        });
    }

    const selectedDate = new Date(date);

    if (isNaN(selectedDate.getTime())) {
        return res.status(422).json({
            error: "Invalid date."
        });
    }

    try {

        let selectedAcademicYear;

        if (academicYearId) {

            selectedAcademicYear = await prisma.academicYear.findUnique({
                where: {
                    id: Number(academicYearId)
                }
            });

            if (!selectedAcademicYear) {
                return res.status(404).json({
                    error: "Academic Year not found."
                });
            }

        } else {

            selectedAcademicYear = await prisma.academicYear.findFirst({
                where: {
                    isActive: true
                }
            });

            if (!selectedAcademicYear) {
                return res.status(404).json({
                    error: "Active Academic Year not found."
                });
            }
        }

        const calendarEntry = await prisma.schoolCalendar.findUnique({
            where: {
                date: selectedDate
            }
        });

        if (!calendarEntry) {
            return res.status(200).json({
                isBlocked: false
            });
        }

        if (calendarEntry.academicYearId !== selectedAcademicYear.id) {
            return res.status(200).json({
                isBlocked: false
            });
        }

        return res.status(200).json({
            isBlocked: true,
            type: calendarEntry.type,
            reason: calendarEntry.reason
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            error: "Something went wrong. Please try again later."
        });
    }
};


const updateHoliday = async (req, res) => {
    const { groupId } = req.params;
    const { from_date, to_date, reason } = req.body;

    if (!from_date || !to_date || !reason) {
        return res.status(422).json({
            error: "From date, to date and reason are required."
        });
    }

    const fromDate = new Date(from_date);
    const toDate = new Date(to_date);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        return res.status(422).json({
            error: "Invalid date."
        });
    }

    if (fromDate > toDate) {
        return res.status(422).json({
            error: "From date cannot be after to date."
        });
    }

    try {
        // Check whether the holiday group exists
        const existingHoliday = await prisma.schoolCalendar.findMany({
            where: {
                holidayGroupId: groupId,
                type: "HOLIDAY"
            },
            select: {
                date: true,
                academicYearId: true
            },
            orderBy: {
                date: "asc"
            }
        });

        if (existingHoliday.length === 0) {
            return res.status(404).json({
                error: "Holiday not found."
            });
        }

        const academicYearId = existingHoliday[0].academicYearId;

        // Get the Academic Year
        const academicYear = await prisma.academicYear.findUnique({
            where: {
                id: academicYearId
            }
        });

        if (!academicYear) {
            return res.status(404).json({
                error: "Academic Year not found."
            });
        }

        // Check whether new dates are within Academic Year
        if (
            fromDate < academicYear.startDate ||
            toDate > academicYear.endDate
        ) {
            return res.status(422).json({
                error: "Holiday dates must be within the Academic Year."
            });
        }

        const dates = [];

        const currentDate = new Date(fromDate);

        while (currentDate <= toDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const existingDates = await prisma.schoolCalendar.findMany({
            where: {
                date: {
                    in: dates
                },
                type: "HOLIDAY",
                academicYearId: academicYearId,
                NOT: {
                    holidayGroupId: groupId
                }
            },
            select: {
                date: true
            }
        });

        if (existingDates.length > 0) {
            const duplicateDates = existingDates.map((item) => {
                return item.date.toISOString().split("T")[0];
            });

            return res.status(422).json({
                error: "Holiday already exists for these dates.",
                dates: duplicateDates
            });
        }

        const result = await prisma.$transaction(async (tx) => {

            await tx.schoolCalendar.deleteMany({
                where: {
                    holidayGroupId: groupId,
                    type: "HOLIDAY"
                }
            });

            return Promise.all(
                dates.map((date) => {
                    return tx.schoolCalendar.create({
                        data: {
                            date: date,
                            type: "HOLIDAY",
                            holidayGroupId: groupId,
                            reason: reason,
                            createdBy: req.user.id,
                            academicYearId: academicYearId
                        }
                    });
                })
            );
        });

        return res.status(200).json({
            message: "Holiday updated successfully.",
            holidays: result
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: "Something went wrong. Please try again later."
        });
    }
};


const deleteHoliday = async (req, res) => {
    const { groupId } = req.params;

    try {
        const existingHoliday = await prisma.schoolCalendar.findMany({
            where: {
                holidayGroupId: groupId,
                type: "HOLIDAY"
            },
            select: {
                id: true
            }
        });

        if (existingHoliday.length === 0) {
            return res.status(404).json({
                error: "Holiday not found."
            });
        }

        await prisma.schoolCalendar.deleteMany({
            where: {
                holidayGroupId: groupId,
                type: "HOLIDAY"
            }
        });

        return res.status(200).json({
            message: "Holiday deleted successfully."
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: "Something went wrong. Please try again later."
        });
    }
};

module.exports = {createHoliday,getHolidays,getHolidayByGroupId,updateHoliday,deleteHoliday,checkCalendarDate};