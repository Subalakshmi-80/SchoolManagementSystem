CREATE TABLE "fee_structure" (
    "id" SERIAL NOT NULL,
    "academic_year_id" INTEGER NOT NULL,
    "standard_id" INTEGER NOT NULL,
    "fee_type" VARCHAR(50) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "due_date" DATE,

    CONSTRAINT "fee_structure_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "fee_structure"
ADD CONSTRAINT "fee_structure_academic_year_id_fkey"
FOREIGN KEY ("academic_year_id")
REFERENCES "academic_year"("id")
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE "fee_structure"
ADD CONSTRAINT "fee_structure_standard_id_fkey"
FOREIGN KEY ("standard_id")
REFERENCES "standards"("id")
ON DELETE NO ACTION
ON UPDATE NO ACTION;