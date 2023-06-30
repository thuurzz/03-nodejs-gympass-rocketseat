/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `check_ins` table. All the data in the column will be lost.
  - You are about to alter the column `latitude` on the `gyms` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - You are about to alter the column `longitude` on the `gyms` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_check_ins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validated_at" DATETIME,
    "user_id" TEXT NOT NULL,
    "gym_id" TEXT NOT NULL,
    CONSTRAINT "check_ins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "check_ins_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_check_ins" ("created_at", "gym_id", "id", "user_id") SELECT "created_at", "gym_id", "id", "user_id" FROM "check_ins";
DROP TABLE "check_ins";
ALTER TABLE "new_check_ins" RENAME TO "check_ins";
CREATE TABLE "new_gyms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "phone" TEXT,
    "latitude" DECIMAL NOT NULL,
    "longitude" DECIMAL NOT NULL
);
INSERT INTO "new_gyms" ("description", "id", "latitude", "longitude", "phone", "title") SELECT "description", "id", "latitude", "longitude", "phone", "title" FROM "gyms";
DROP TABLE "gyms";
ALTER TABLE "new_gyms" RENAME TO "gyms";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
