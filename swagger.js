'use strict'

const swaggerJsdoc = require('swagger-jsdoc')
const config = require('./config')

// ── 共用 Schemas ──────────────────────────────────────────────────────────────

const Post = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    content: { type: 'string' },
    isActive: { type: 'boolean' },
    date: { type: 'string', format: 'date-time' }
  }
}

const AuthData = {
  type: 'object',
  properties: {
    token: { type: 'string' },
    authenticated: { type: 'boolean' },
    user: { type: 'string' },
    email: { type: 'string', format: 'email' },
    role: { type: 'string', enum: ['account', 'admin'] }
  }
}

// ── 共用 Responses ────────────────────────────────────────────────────────────
// 此專案所有 HTTP 狀態碼均為 200，以 success 欄位區分成功與失敗。

const envelope = (dataSchema) => ({
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    errors: { type: 'array', items: { type: 'string' }, example: [] },
    errfor: { type: 'object', additionalProperties: { type: 'string' }, example: {} },
    ...(dataSchema ? { data: dataSchema } : {})
  }
})

const Success = {
  description: '成功',
  content: { 'application/json': { schema: envelope() } }
}

const AuthSuccess = {
  description: '認證成功，回傳 JWT token',
  content: { 'application/json': { schema: envelope(AuthData) } }
}

const ValidationError = {
  description: '驗證失敗，success: false，錯誤詳情在 errors / errfor',
  content: { 'application/json': { schema: envelope() } }
}

// ─────────────────────────────────────────────────────────────────────────────

module.exports = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: config.projectName + ' API',
      version: '1.0.0',
      description: config.projectName + ' 後端 REST API 文件'
    },
    tags: [
      { name: '公開', description: '不需登入' },
      { name: '帳號', description: '需登入' },
      { name: '管理員', description: '需管理員權限' },
      { name: '文章', description: 'Post 範例 CRUD（v1）' },
      { name: '文章 v2', description: 'Post 範例 CRUD（v2，ODMService）' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: { Post, AuthData },
      responses: { Success, AuthSuccess, ValidationError }
    }
  },
  apis: ['./controllers/**/*.js']
})
