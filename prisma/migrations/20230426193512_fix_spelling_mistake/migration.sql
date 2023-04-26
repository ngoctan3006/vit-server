/*
  Warnings:

  - You are about to drop the column `deparment_id` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the `DeparmentUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `department_id` to the `Club` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Club" DROP CONSTRAINT "Club_deparment_id_fkey";

-- DropForeignKey
ALTER TABLE "DeparmentUser" DROP CONSTRAINT "DeparmentUser_department_id_fkey";

-- DropForeignKey
ALTER TABLE "DeparmentUser" DROP CONSTRAINT "DeparmentUser_user_id_fkey";

-- AlterTable
ALTER TABLE "Club" DROP COLUMN "deparment_id",
ADD COLUMN     "department_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "DeparmentUser";

-- CreateTable
CREATE TABLE "DepartmentUser" (
    "id" SERIAL NOT NULL,
    "department_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "position" "Position" NOT NULL DEFAULT 'MEMBER',
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepartmentUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentUser_department_id_user_id_key" ON "DepartmentUser"("department_id", "user_id");

-- AddForeignKey
ALTER TABLE "DepartmentUser" ADD CONSTRAINT "DepartmentUser_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentUser" ADD CONSTRAINT "DepartmentUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;
