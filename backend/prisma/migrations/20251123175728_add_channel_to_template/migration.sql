-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "channel" TEXT NOT NULL DEFAULT 'email';

-- AlterTable
ALTER TABLE "TemplateVersion" ADD COLUMN     "channel" TEXT NOT NULL DEFAULT 'email';
