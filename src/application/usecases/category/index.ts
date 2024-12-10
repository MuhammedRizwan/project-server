import {
  CategoryRepository,
  Icategory,
} from "../../../domain/entities/category/category";
import { Dependencies } from "../../../domain/entities/depencies/depencies";
import { CloudinaryService } from "../../../domain/entities/services/service";
import { CustomError } from "../../../domain/errors/customError";

export class CategoryUseCase {
  private _categoryRepository: CategoryRepository;
  private _cloudinaryService: CloudinaryService;
  constructor(dependencies: Dependencies) {
    this._categoryRepository = dependencies.Repositories.CategoryRepository;
    this._cloudinaryService = dependencies.Services.CloudinaryService;
  }
  async createCategory(
    category: Icategory,
    file: { Document: Express.Multer.File | undefined }
  ) {
    try {
      const isExist = await this._categoryRepository.findByCategoryName(
        category.category_name
      );
      if (isExist) {
        throw new CustomError("catagory Already Exist", 409);
      }
      category.image = await this._cloudinaryService.uploadImage(file.Document);
      const createdCategory = await this._categoryRepository.createCategory(
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
        await this._categoryRepository.blockNUnblockCategory(id, is_block);
      if (!updatedCategory) {
        throw new CustomError("catagory Updation Failed", 500);
      }
      return updatedCategory;
    } catch (error) {
      throw error;
    }
  }
  async findAllCategory(
    search: string,
    page: number,
    limit: number,
    filter: string
  ) {
    try {
      const query = search
        ? { category_name: { $regex: search, $options: "i" } }
        : {};
      const filterData =
        filter === "all"
          ? {}
          : { is_block: filter === "blocked" ? true : false };
      const categories = await this._categoryRepository.findAllCategory(
        query,
        page,
        limit,
        filterData
      );
      if (!categories) {
        throw new CustomError("catagory Not Found", 404);
      }
      const totalItems = await this._categoryRepository.countDocument(
        query,
        filterData
      );
      if (totalItems === 0) {
        throw new CustomError("catagory Not Found", 404);
      }
      return {
        categories,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      };
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
      const isExist = await this._categoryRepository.findCategoryById(id);
      if (!isExist) {
        throw new CustomError("catagory Not Found", 404);
      }
      const nameExit = await this._categoryRepository.findByCategoryName(
        catagory.category_name
      );
      if (
        nameExit &&
        nameExit?._id != undefined &&
        nameExit._id.toString() !== id
      ) {
        throw new CustomError("catagory Already Exist", 409);
      }
      if (file.Document) {
        catagory.image = await this._cloudinaryService.uploadImage(
          file.Document
        );
      }
      const updatedCategory = await this._categoryRepository.editCategory(
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
  async getUnblockedCategories() {
    try {
      const categories =
        await this._categoryRepository.getUnblockedCategories();
      if (!categories) {
        throw new CustomError("catagory Not Found", 404);
      }
      if (categories.length === 0) {
        throw new CustomError("catagory Not Found", 404);
      }
      return categories;
    } catch (error) {
      throw error;
    }
  }
}
