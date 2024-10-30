import { FilterQuery } from "mongoose";
import { Icategory } from "../../domain/entities/category/category";
import categoryModel from "../database/models/categoryModel";

export class MongoCategoryRepository {
  async createCategory(category: Icategory): Promise<Icategory | null> {
    const createdCategory = await categoryModel.create(category);
    return createdCategory
      ? (createdCategory.toObject() as unknown as Icategory)
      : null;
  }
  async findCategoryById(id: string): Promise<Icategory | null> {
    const category: Icategory | null = await categoryModel.findOne({ _id: id });
    return category;
  }
  async findByCategoryName(category_name: string): Promise<Icategory | null> {
    const category: Icategory | null = await categoryModel.findOne({
      category_name: { $regex: new RegExp(`^${category_name}$`, 'i') },
    });
    return category;
  }
  async blockNUnblockCategory(id: string,is_block: boolean): Promise<Icategory | null> {
    return categoryModel.findOneAndUpdate(
      { _id: id },
      { $set: { is_block } },
      { new: true }
    );
  }

  async findAllCategory(query: FilterQuery<Icategory>, page: number, limit: number): Promise<Icategory[]> {
    const categories = await categoryModel.find(query).lean().skip((page - 1) * limit).limit(limit);
    return categories.map((category) => ({ ...category, _id: category._id.toString() }));
  }

  async countDocument(query: FilterQuery<Icategory>): Promise<number> {
    return categoryModel.countDocuments(query);
  }
  async editCategory(
    id: string,catagory: Icategory
  ): Promise<Icategory | null> {
    const updatedCategory: Icategory | null = await categoryModel.findOneAndUpdate(
      { _id: id },
      { $set: catagory},
      { new: true }
    );
    return updatedCategory;
  }
  async getUnblockedCategories(): Promise<Icategory[] | null> {
    const categories = await categoryModel.find({is_block: false}).lean();
    return categories.map((category) => ({ ...category, _id: category._id?.toString() }));
  }
}
