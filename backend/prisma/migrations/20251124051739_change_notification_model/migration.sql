-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "recipient" TEXT,
ADD COLUMN     "renderedContent" TEXT,
ADD COLUMN     "renderedSubject" TEXT,
ADD COLUMN     "templateId" TEXT,
ALTER COLUMN "payload" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
