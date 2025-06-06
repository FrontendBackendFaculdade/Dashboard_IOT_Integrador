import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default{
    async findAllRegistros(request, response){
        try{
            const registros = await prisma.registros.findMany();

            return response.json({registros});

        }catch(error){
            return response.json({ message: error.message })
        }
    }

}