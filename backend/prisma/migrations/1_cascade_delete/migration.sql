ALTER TABLE "public"."teachers"
DROP CONSTRAINT "teachers_user_id_fkey";

ALTER TABLE "public"."teachers"
ADD CONSTRAINT "teachers_user_id_fkey"
FOREIGN KEY ("user_id")
REFERENCES "public"."users"("id")
ON DELETE CASCADE
ON UPDATE NO ACTION;

ALTER TABLE "public"."students"
DROP CONSTRAINT "students_user_id_fkey";

ALTER TABLE "public"."students"
ADD CONSTRAINT "students_user_id_fkey"
FOREIGN KEY ("user_id")
REFERENCES "public"."users"("id")
ON DELETE CASCADE
ON UPDATE NO ACTION;

ALTER TABLE "public"."marks"
DROP CONSTRAINT "marks_student_id_fkey";

ALTER TABLE "public"."marks"
ADD CONSTRAINT "marks_student_id_fkey"
FOREIGN KEY ("student_id")
REFERENCES "public"."students"("id")
ON DELETE CASCADE
ON UPDATE NO ACTION;

ALTER TABLE "public"."marks"
DROP CONSTRAINT "marks_test_id_fkey";

ALTER TABLE "public"."marks"
ADD CONSTRAINT "marks_test_id_fkey"
FOREIGN KEY ("test_id")
REFERENCES "public"."tests"("id")
ON DELETE CASCADE
ON UPDATE NO ACTION;