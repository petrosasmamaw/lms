import { success, error } from '../utils/response.js'
import * as resourceService from '../services/resourceService.js'
import cloudinary from '../config/cloudinary.js'

export async function uploadResource(req, res, next) {
  try {
    if (!req.file) return error(res, 'No file uploaded', 400)
    const { originalname, mimetype, path } = req.file
    const course_id = req.body.course_id
    // upload to cloudinary
    const result = await cloudinary.uploader.upload(path, { resource_type: 'auto' })

    const resource = await resourceService.createResource({
      title: req.body.title || originalname,
      file_url: result.secure_url,
      file_type: mimetype,
      course_id: course_id ? Number(course_id) : null,
    })

    return success(res, { resource }, 'Resource uploaded', 201)
  } catch (err) {
    next(err)
  }
}

export async function listResources(req, res, next) {
  try {
    const { courseId } = req.query
    if (!courseId) return error(res, 'courseId query required', 400)
    const list = await resourceService.getResourcesByCourse(courseId)
    return success(res, { resources: list }, 'Resources')
  } catch (err) {
    next(err)
  }
}

export async function deleteResource(req, res, next) {
  try {
    const { id } = req.params
    await resourceService.deleteResource(id)
    return success(res, {}, 'Resource deleted')
  } catch (err) {
    next(err)
  }
}
