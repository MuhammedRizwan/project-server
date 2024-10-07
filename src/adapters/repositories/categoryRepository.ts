import { Icategory } from "../../domain/entities/category/category";
import categoryModel from "../database/models/categoryModel";

export class MongoCategoryRepository {
  async createCategory(category: Icategory): Promise<Icategory | null> {
    const createdCategory = await categoryModel.create(category);
    return createdCategory
      ? (createdCategory.toObject() as unknown as Icategory)
      : null;
  }
  async findByCategoryName(category_name: string): Promise<Icategory | null> {
    const category: Icategory | null = await categoryModel.findOne({
      category_name: { $regex: new RegExp(`^${category_name}$`, 'i') },
    });
    return category;
  }
  blockNUnblockCategory(category_name: string,is_block: boolean): Promise<Icategory | null> {
    return categoryModel.findOneAndUpdate(
      { category_name: { $regex: new RegExp(`^${category_name}$`, 'i') } },
      { $set: { is_block } },
      { new: true }
    );
  }

  async findAllCategory(): Promise<Icategory[]> {
    const categories: Icategory[] = await categoryModel.find();
    return categories;
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
}
