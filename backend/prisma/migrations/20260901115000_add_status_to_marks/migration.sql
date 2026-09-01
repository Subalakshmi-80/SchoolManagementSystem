-- AlterTable
ALTER TABLE "marks" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Present',
ALTER COLUMN "std_marks" DROP NOT NULL;
