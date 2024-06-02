const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

// create subsection

exports.createSubSection = async (req, res) => {
  try {
    // data fetch from req body
    // extract file/video
    const { sectionId, title, timeDuration, description } = req.body;
    const video = req.files.videoFile;

    // data validation
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All field are required",
      });
    }
    console.log("before video upload");

    // upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    console.log("after video upload");

    // create subsection
    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    // update section with this subsection
    const updatedSextion = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: SubSectionDetails._id,
        },
      },
      { new: true }
    );
    // return response
    return res.status(200).json({
      success: true,
      message: "Sub section created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update subsection handler

exports.updateSubSection = async (req, res) => {
  try {
    // data fetch from req body
    const { subsectionId, title, description, timeDuration } = req.body;
    // data validation
    if (!subsectionId && (!title || !description || !timeDuration)) {
      return res.status(400).json({
        success: false,
        message: "Section id is required",
      });
    }
    // creating a payload
    const payload = {};
    if (title) {
      payload.title = title;
    }
    if (description) {
      payload.description = description;
    }
    if (timeDuration) {
      payload.timeDuration = timeDuration;
    }
    // updating values in db
    const updatedSubsection = await SubSection.findByIdAndUpdate(
      subsectionId,
      payload,
      { new: true }
    );
    // return response
    return res.status(200).json({
      success: true,
      message: "Subsection updated successfully",
      updatedSubsection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot update the sucsection ",
    });
  }
};

// delete subsection

exports.deleteSubSection = async (req, res) => {
  try {
    // get subsection id from params
    const { subsectionId } = req.params;

    // delete subsection from db
    await SubSection.findByIdAndDelete(subsectionId);

    // return response
    return res.status(200).json({
      success: true,
      message: "Subsection deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot delete the sucsection ",
    });
  }
};
