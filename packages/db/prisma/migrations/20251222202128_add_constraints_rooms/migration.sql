/*
  Warnings:

  - A unique constraint covering the columns `[roomname]` on the table `Rooms` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rooms_roomname_key" ON "Rooms"("roomname");
