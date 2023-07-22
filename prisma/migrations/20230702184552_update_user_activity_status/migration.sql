/*
  Warnings:

  - The values [CANCLED] on the enum `UserActivityStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserActivityStatus_new" AS ENUM ('REGISTERED', 'ACCEPTED', 'WITHDRAWN', 'REJECTED');
ALTER TABLE "UserActivity" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "UserEvent" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "UserActivity" ALTER COLUMN "status" TYPE "UserActivityStatus_new" USING ("status"::text::"UserActivityStatus_new");
ALTER TABLE "UserEvent" ALTER COLUMN "status" TYPE "UserActivityStatus_new" USING ("status"::text::"UserActivityStatus_new");
ALTER TYPE "UserActivityStatus" RENAME TO "UserActivityStatus_old";
ALTER TYPE "UserActivityStatus_new" RENAME TO "UserActivityStatus";
DROP TYPE "UserActivityStatus_old";
ALTER TABLE "UserActivity" ALTER COLUMN "status" SET DEFAULT 'REGISTERED';
ALTER TABLE "UserEvent" ALTER COLUMN "status" SET DEFAULT 'REGISTERED';
COMMIT;
