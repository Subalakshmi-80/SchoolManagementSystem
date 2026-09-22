-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT');

-- CreateEnum
CREATE TYPE "CalendarType" AS ENUM ('HOLIDAY', 'WEEKLY_OFF');


-- CreateTable
CREATE TABLE "attendance" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "marked_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);


-- CreateTable
CREATE TABLE "school_calendar" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "type" "CalendarType" NOT NULL,
    "reason" VARCHAR(255),
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "school_calendar_pkey" PRIMARY KEY ("id")
);


-- CreateIndex
CREATE UNIQUE INDEX "attendance_student_id_date_key"
ON "attendance"("student_id", "date");


-- CreateIndex
CREATE UNIQUE INDEX "school_calendar_date_key"
ON "school_calendar"("date");


-- AddForeignKey
ALTER TABLE "attendance"
ADD CONSTRAINT "attendance_student_id_fkey"
FOREIGN KEY ("student_id")
REFERENCES "students"("id")
ON DELETE CASCADE
ON UPDATE NO ACTION;


-- AddForeignKey
ALTER TABLE "attendance"
ADD CONSTRAINT "attendance_marked_by_fkey"
FOREIGN KEY ("marked_by")
REFERENCES "users"("id")
ON DELETE NO ACTION
ON UPDATE NO ACTION;


-- AddForeignKey
ALTER TABLE "school_calendar"
ADD CONSTRAINT "school_calendar_created_by_fkey"
FOREIGN KEY ("created_by")
REFERENCES "users"("id")
ON DELETE NO ACTION
ON UPDATE NO ACTION;