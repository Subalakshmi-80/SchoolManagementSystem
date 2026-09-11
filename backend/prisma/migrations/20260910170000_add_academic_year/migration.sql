CREATE TABLE "academic_year" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "academic_year_pkey" PRIMARY KEY ("id")
);