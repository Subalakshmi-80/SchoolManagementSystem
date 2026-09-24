ALTER TABLE "attendance"
ADD COLUMN "academic_year_id" INTEGER NOT NULL;

ALTER TABLE "school_calendar"
ADD COLUMN "academic_year_id" INTEGER NOT NULL;

ALTER TABLE "attendance"
ADD CONSTRAINT "attendance_academic_year_id_fkey"
FOREIGN KEY ("academic_year_id")
REFERENCES "academic_year"("id")
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE "school_calendar"
ADD CONSTRAINT "school_calendar_academic_year_id_fkey"
FOREIGN KEY ("academic_year_id")
REFERENCES "academic_year"("id")
ON DELETE NO ACTION
ON UPDATE NO ACTION;