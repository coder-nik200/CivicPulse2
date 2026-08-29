import Authority from "../models/Authority.js";

export const createAuthority = async (req, res) => {
  try {
    const { name, department, email, issueTypes, area } = req.body;

    const authority = await Authority.create({
      name,
      department,
      email,
      issueTypes,
      area,
    });

    res.status(201).json({
      success: true,
      authority,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create authority",
    });
  }
};

export const getAuthorities = async (req, res) => {
  try {
    const authorities = await Authority.find({
      active: true,
    });

    res.json({
      success: true,
      authorities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch authorities",
    });
  }
};
