/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Manager` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Manager_username_key` ON `Manager`(`username`);
