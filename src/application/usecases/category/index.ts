import { Icategory } from "../../../domain/entities/category/category";
import { CustomError } from "../../../domain/errors/customError";

interface MongoCategoryRepository {
  createCategory(category: Icategory): Promise<Icategory | null>;
  findByCategoryName(category_name: string): Promise<Icategory | null>;
  blockNUnblockCategory(
    id: string,
    is_block: boolean
  ): Promise<Icategory | null>;
  findAllCategory(query:object,page:number,limit:number): Promise<Icategory[]>;
  editCategory(id: string, catagory: Icategory): Promise<Icategory | null>;
  countDocument(query:object): Promise<number>;
  findCategoryById(id: string): Promise<Icategory | null>;
}
interface CloudinaryService {
  uploadImage(file: Express.Multer.File | undefined): Promise<string>;
}

interface Dependencies {
  Repositories: {
    MongoCategoryRepository: MongoCategoryRepository;
  };
  Services: {
    CloudinaryService: CloudinaryService;
  };
}
export class CategoryUseCase {
  private categoryRepository: MongoCategoryRepository;
  private cloudinaryService: CloudinaryService;
  constructor(dependencies: Dependencies) {
    this.categoryRepository = dependencies.Repositories.MongoCategoryRepository;
    this.cloudinaryService = dependencies.Services.CloudinaryService;
  }
  async createCategory(
    category: Icategory,
    file: { Document: Express.Multer.File | undefined }
  ) {
    try {
      const isExist = await this.categoryRepository.findByCategoryName(
        category.category_name
      );
      if (isExist) {
        throw new CustomError("catagory Already Exist", 409);
      }
      category.image = await this.cloudinaryService.uploadImage(file.Document);
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
  async blocknUnblockCategory(id: string, is_block: boolean) {
    try {
      const updatedCategory =
        await this.categoryRepository.blockNUnblockCategory(id, is_block);
      if (!updatedCategory) {
        throw new CustomError("catagory Updation Failed", 500);
      }
      return updatedCategory;
    } catch (error) {
      throw error;
    }
  }
  async findAllCategory(search:string,page:number,limit:number) {
    try {
    const query = search
      ? { category_name: { $regex: search, $options: 'i' } } 
      : {};
      const categories = await this.categoryRepository.findAllCategory(query,page,limit);
      if (!categories) {
        throw new CustomError("catagory Not Found", 404);
      }
      const totalItems=await this.categoryRepository.countDocument(query);
      if(totalItems===0){
        throw new CustomError("catagory Not Found", 404);
      }
      return {
        categories,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,};
    } catch (error) {
      throw error;
    }
  }
  async updateCategory(
    id: string,
    catagory: Icategory,
    file: { Document: Express.Multer.File | undefined }
  ) {
    try {
      const isExist = await this.categoryRepository.findCategoryById(id);
      if (!isExist) {
        throw new CustomError("catagory Not Found", 404);
      }
      if(file.Document){
        catagory.image = await this.cloudinaryService.uploadImage(file.Document);
      }
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
