import { NextFunction, Request, Response } from "express";
import { CategoryUseCase } from "../../application/usecases/category";
import HttpStatusCode from "../../domain/enum/httpstatus";

interface Dependencies {
  useCase: {
    CategoryUseCase: CategoryUseCase;
  };
}
const isString = (value: unknown): value is string => typeof value === 'string';

export class categoryController {
  private _categoryUseCase: CategoryUseCase;
  constructor(dependencies: Dependencies) {
    this._categoryUseCase = dependencies.useCase.CategoryUseCase;
  }
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await this._categoryUseCase.createCategory(req.body, {
        Document: req.file,
      });
      return res
        .status(HttpStatusCode.CREATED)
        .json({ success:true, message: "Category Created", category });
    } catch (error) {
      next(error);
    }
  }
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      
      const search = isString(req.query.search) ? req.query.search : "";
      const page = isString(req.query.page) ? parseInt(req.query.page, 10) : 1;
      const limit = isString(req.query.limit) ? parseInt(req.query.limit, 10) : 3;
      const filter=isString(req.query.filter) ? req.query.filter : "";
      const { categories ,totalItems,totalPages,currentPage} = await this._categoryUseCase.findAllCategory(
        search,
        page,
        limit,
        filter
      );
      return res.status(HttpStatusCode.OK).json({
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
      const category = await this._categoryUseCase.blocknUnblockCategory(
        id,
        is_block
      );
      return res.status(HttpStatusCode.OK).json({
        success:true,
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
      const category = await this._categoryUseCase.updateCategory(
        categoryId,
        req.body,
        {
          Document: req.file,
        }
      );
      return res
        .status(HttpStatusCode.OK)
        .json({ success:true, message: "Category Updated", category });
    } catch (error) {
      next(error);
    }
  }
  async getUnblockedCategories(req:Request,res:Response,next:NextFunction){
    try {
      const categories=await this._categoryUseCase.getUnblockedCategories();
      return res.status(HttpStatusCode.OK).json({success:true,message:"Fetched All Categories",categories})
    } catch (error) {
      next(error)
    }
  }
}
