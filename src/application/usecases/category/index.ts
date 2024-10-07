import { Icategory } from "../../../domain/entities/category/category";
import { CustomError } from "../../../domain/errors/customError";

interface MongoCategoryRepository {
  createCategory(category: Icategory): Promise<Icategory | null>;
  findByCategoryName(category_name: string): Promise<Icategory | null>;
  blockNUnblockCategory(
    category_name: string,
    is_block: boolean
  ): Promise<Icategory | null>;
  findAllCategory(): Promise<Icategory[]>;
  editCategory(id: string, catagory: Icategory): Promise<Icategory | null>;
}
interface CloudinaryService{
  uploadImage(file: Express.Multer.File|undefined): Promise<string>;
}

interface Dependencies {
  Repositories: {
    MongoCategoryRepository: MongoCategoryRepository;
  };
  Services: {
    CloudinaryService:CloudinaryService
  };
}
export class CategoryUseCase {
  private categoryRepository: MongoCategoryRepository;
  private cloudinaryService:CloudinaryService
  constructor(dependencies: Dependencies) {
    this.categoryRepository = dependencies.Repositories.MongoCategoryRepository;
    this.cloudinaryService=dependencies.Services.CloudinaryService
  }
  async createCategory(category: Icategory,file: { Document: Express.Multer.File|undefined }) {
    try {
      const isExist = await this.categoryRepository.findByCategoryName(
        category.category_name
      );
      if (isExist) {
        throw new CustomError("catagory Already Exist", 409);
      }
      category.image=await this.cloudinaryService.uploadImage(file.Document)
      const createdCategory = await this.categoryRepository.createCategory(
        category
      );
      if (!createdCategory) {
        throw new CustomError("catagory Creation Failed", 500);
      }
      return createdCategory;
    } catch (error) {
      throw error;
    }
  }
  async blocknUnblockCategory(category_name: string, is_block: boolean) {
    try {
      const isExist = await this.categoryRepository.findByCategoryName(
        category_name
      );
      if (!isExist) {
        throw new CustomError("catagory Not Found", 404);
      }
      const updatedCategory =
        await this.categoryRepository.blockNUnblockCategory(
          category_name,
          is_block
        );
      if (!updatedCategory) {
        throw new CustomError("catagory Updation Failed", 500);
      }
      return updatedCategory;
    } catch (error) {
      throw error;
    }
  }
  async findAllCategory() {
    try {
      const categories = await this.categoryRepository.findAllCategory();
      if (!categories) {
        throw new CustomError("catagory Not Found", 404);
      }
      return categories;
    } catch (error) {
      throw error;
    }
  }
  async updateCategory(id: string, catagory: Icategory,file: { Document: Express.Multer.File|undefined }) {
    try {
      const isExist = await this.categoryRepository.findByCategoryName(
        catagory.category_name
      );
      if (!isExist) {
        throw new CustomError("catagory Not Found", 404);
      }
      catagory.image=await this.cloudinaryService.uploadImage(file.Document)
      const updatedCategory = await this.categoryRepository.editCategory(
        id,
        catagory
      );
      if (!updatedCategory) {
        throw new CustomError("catagory Updation Failed", 500);
      }
      return updatedCategory;
    } catch (error) {
      throw error;
    }
  }
}
