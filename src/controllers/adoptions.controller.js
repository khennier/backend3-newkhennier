import { adoptionsService, petsService, usersService } from "../services/index.js"

const getAllAdoptions = async(req,res)=>{
    const result = await adoptionsService.getAll();
    res.send({status:"success",payload:result})
}

const getAdoption = async(req,res)=>{
    const adoptionId = req.params.aid;
    const adoption = await adoptionsService.getBy({_id:adoptionId})
    if(!adoption) return res.status(404).send({status:"error",error:"Adoption not found"})
    res.send({status:"success",payload:adoption})
}

const createAdoption = async (req, res) => {
    try {
      const { uid, pid } = req.params;
  
      // Verificar si el usuario existe
      const user = await usersService.getUserById(uid);
      if (!user) return res.status(404).send({ status: "error", error: "User not found" });
  
      // Verificar si la mascota existe
      const pet = await petsService.getBy({ _id: pid });
      if (!pet) return res.status(404).send({ status: "error", error: "Pet not found" });
  
      // Verificar si la mascota ya está adoptada
      if (pet.adopted) {
        return res.status(400).send({ status: "error", error: "Pet is already adopted" });
      }
  
      // Actualizar mascota (adoptada y asignar propietario)
      pet.adopted = true;
      pet.owner = user._id;
      await petsService.update(pet._id, { adopted: true, owner: user._id });
  
      // Actualizar usuario (agregar la mascota a su lista)
      user.pets.push({ _id: pet._id });
      await usersService.update(user._id, { pets: user.pets });
  
      // Crear registro de adopción
      const adoption = await adoptionsService.create({ owner: user._id, pet: pet._id });
  
      res.status(201).send({
        status: "success",
        message: "Pet adopted successfully",
        payload: adoption,
      });
    } catch (error) {
      res.status(500).send({
        status: "error",
        message: "Error processing adoption",
        details: error.message,
      });
    }
  };
  
export default {
    createAdoption,
    getAllAdoptions,
    getAdoption
}