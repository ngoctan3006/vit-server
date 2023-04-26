/*
  Warnings:

  - The `status` column on the `UserEvent` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UserEvent" DROP COLUMN "status",
ADD COLUMN     "status" "UserActivityStatus" NOT NULL DEFAULT 'REGISTERED';
