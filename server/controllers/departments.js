import mongoose from 'mongoose';
import Department from '../models/Department.js';

export const viewAllDepartments = async (req, res) => {
  try {
    const data = await Department.find();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const newDepartment = new Department(req.body);
    await newDepartment.save();
    res.json({
      success: true,
      data: newDepartment,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDepartment = async (req, res) => {
  const { id: _id } = req.params;
  const newDepartment = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send(`No department found with ID: ${_id}`);

  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      _id,
      newDepartment,
      {
        new: true,
      }
    );
    res.json({
      success: true,
      data: updatedDepartment,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const addMembers = async (req, res) => {
  const { id: _id } = req.params;
  const { userIds } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send(`No department found with ID: ${_id}`);

  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      _id,
      {
        $addToSet: { members: userIds },
      },
      {
        new: true,
      }
    );
    res.json({
      success: true,
      data: updatedDepartment,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeMembers = async (req, res) => {
  const { id: _id } = req.params;
  const { userIds } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send(`No department found with ID: ${_id}`);

  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      _id,
      {
        $pull: { members: { $in: userIds } },
      },
      {
        new: true,
      }
    );
    res.json({
      success: true,
      data: updatedDepartment,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteDepartment = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send(`No department found with ID: ${_id}`);

  try {
    await Department.findByIdAndRemove(_id);
    res.json({
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
