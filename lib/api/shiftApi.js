// lib/api/shifts.js

import apiClient from "../apiClient"


export const shiftsApi = {
  // Get all shifts with filters
  getShifts: async (params = {}) => {
    const { data } = await apiClient.get("/api/v1/shifts", { params })
    return data
  },

  // Get single shift
  getShift: async (id) => {
    const { data } = await apiClient.get(`/api/v1/shifts/${id}`)
    return data
  },

  // Create shift
  createShift: async (shiftData) => {
    const { data } = await apiClient.post("/api/v1/shifts", shiftData)
    return data
  },

  // Update shift
  updateShift: async (id, shiftData) => {
    const { data } = await apiClient.put(`/api/v1/shifts/${id}`, shiftData)
    return data
  },

  // Delete shift
  deleteShift: async (id) => {
    const { data } = await apiClient.delete(`/api/v1/shifts/${id}`)
    return data
  },

  // Toggle shift status
  toggleStatus: async (id) => {
    const { data } = await apiClient.post(`/api/v1/shifts/${id}/toggle-status`)
    return data
  },

  // Get employees in shift
  getShiftEmployees: async (id) => {
    const { data } = await apiClient.get(`/api/v1/shifts/${id}/employees`)
    return data
  },
}