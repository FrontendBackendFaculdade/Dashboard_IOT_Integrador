-- CreateTable
CREATE TABLE `registros` (
    `codigo` INTEGER NOT NULL AUTO_INCREMENT,
    `codCor` INTEGER NOT NULL,
    `codMaterial` INTEGER NOT NULL,
    `codTamanho` INTEGER NOT NULL,
    `dataMovimentacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cores` (
    `codigo` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materiais` (
    `codigo` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tamanhos` (
    `codigo` INTEGER NOT NULL AUTO_INCREMENT,
    `tamanho` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `registros` ADD CONSTRAINT `registros_codCor_fkey` FOREIGN KEY (`codCor`) REFERENCES `cores`(`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `registros` ADD CONSTRAINT `registros_codMaterial_fkey` FOREIGN KEY (`codMaterial`) REFERENCES `materiais`(`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `registros` ADD CONSTRAINT `registros_codTamanho_fkey` FOREIGN KEY (`codTamanho`) REFERENCES `tamanhos`(`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
