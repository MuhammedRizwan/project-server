import { NextFunction, Request, Response } from "express";
import { CategoryUseCase } from "../../../application/usecases/category";

interface Dependencies {
  useCase: {
    CategoryUseCase: CategoryUseCase;
  };
}
const isString = (value: unknown): value is string => typeof value === 'string';

export class categoryController {
  private categoryUseCase: CategoryUseCase;
  constructor(dependencies: Dependencies) {
    this.categoryUseCase = dependencies.useCase.CategoryUseCase;
  }
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await this.categoryUseCase.createCategory(req.body, {
        Document: req.file,
      });
      return res
        .status(201)
        .json({ status: "success", message: "Category Created", category });
    } catch (error) {
      next(error);
    }
  }
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      
      const search = isString(req.query.search) ? req.query.search : "";
      const page = isString(req.query.page) ? parseInt(req.query.page, 10) : 1;
      const limit = isString(req.query.limit) ? parseInt(req.query.limit, 10) : 3;
  
      const { categories ,totalItems,totalPages,currentPage} = await this.categoryUseCase.findAllCategory(
        search,
        page,
        limit
      );
      return res.status(200).json({
        status: "success",
        message: "Fetched All Categories",
        filterData:categories,
        totalPages,
        totalItems,
        currentPage
      });
    } catch (error) {
      next(error);
    }
  }
  async blockNUnblockCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, is_block } = req.body;
      const category = await this.categoryUseCase.blocknUnblockCategory(
        id,
        is_block
      );
      return res.status(200).json({
        status: "success",
        message: `${
          category.is_block ? "Category Blocked" : "Category Unblocked"
        }`,
        category,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.params;
      const category = await this.categoryUseCase.updateCategory(
        categoryId,
        req.body,
        {
          Document: req.file,
        }
      );
      return res
        .status(200)
        .json({ status: "success", message: "Category Updated", category });
    } catch (error) {
      next(error);
    }
  }
}
