CREATE TABLE "fee_payment" (
    "id" SERIAL NOT NULL,
    "receipt_no" VARCHAR(30) NOT NULL,
    "student_id" INTEGER NOT NULL,
    "fee_structure_id" INTEGER NOT NULL,
    "amount_paid" DECIMAL(10,2) NOT NULL,
    "payment_date" DATE NOT NULL,
    "remarks" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fee_payment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "fee_payment_receipt_no_key"
ON "fee_payment"("receipt_no");

ALTER TABLE "fee_payment"
ADD CONSTRAINT "fee_payment_student_id_fkey"
FOREIGN KEY ("student_id")
REFERENCES "students"("id")
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE "fee_payment"
ADD CONSTRAINT "fee_payment_fee_structure_id_fkey"
FOREIGN KEY ("fee_structure_id")
REFERENCES "fee_structure"("id")
ON DELETE NO ACTION
ON UPDATE NO ACTION;