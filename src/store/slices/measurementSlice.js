import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  measurements: [],
  templates: [
    { id: "1", enName: "Chest", urName: "سینہ", category: "shirt" },
    { id: "2", enName: "Waist", urName: "کمر", category: "shirt" },
    { id: "3", enName: "Length", urName: "لمبائی", category: "shirt" },
    { id: "4", enName: "Shoulder", urName: "کندھا", category: "shirt" },
    { id: "5", enName: "Sleeve", urName: "آستین", category: "shirt" },
    { id: "6", enName: "Neck", urName: "گردن", category: "shirt" },
    { id: "7", enName: "Inseam", urName: "اندرونی سیون", category: "pants" },
    { id: "8", enName: "Outseam", urName: "بیرونی سیون", category: "pants" },
    { id: "9", enName: "Thigh", urName: "ران", category: "pants" },
    { id: "10", enName: "Hip", urName: "کولہا", category: "pants" },
  ],
  loading: false,
  error: null,
  selectedCategory: "all",
};

const measurementSlice = createSlice({
  name: "measurements",
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Measurement CRUD operations
    addMeasurement: (state, action) => {
      const newMeasurement = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.measurements.push(newMeasurement);
      state.loading = false;
      state.error = null;
    },

    updateMeasurement: (state, action) => {
      const { id, ...updates } = action.payload;
      const measurementIndex = state.measurements.findIndex((m) => m.id === id);
      if (measurementIndex !== -1) {
        state.measurements[measurementIndex] = {
          ...state.measurements[measurementIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      state.loading = false;
      state.error = null;
    },

    deleteMeasurement: (state, action) => {
      state.measurements = state.measurements.filter(
        (m) => m.id !== action.payload
      );
      state.loading = false;
      state.error = null;
    },

    setMeasurements: (state, action) => {
      state.measurements = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Template management
    addTemplate: (state, action) => {
      const newTemplate = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
      };
      state.templates.push(newTemplate);
    },

    updateTemplate: (state, action) => {
      const { id, ...updates } = action.payload;
      const templateIndex = state.templates.findIndex((t) => t.id === id);
      if (templateIndex !== -1) {
        state.templates[templateIndex] = {
          ...state.templates[templateIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    deleteTemplate: (state, action) => {
      state.templates = state.templates.filter((t) => t.id !== action.payload);
    },

    // Category filter
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },

    // Bulk operations
    addMultipleMeasurements: (state, action) => {
      const measurements = action.payload.map((measurement) => ({
        id: Date.now().toString() + Math.random(),
        ...measurement,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      state.measurements.push(...measurements);
    },

    deleteMultipleMeasurements: (state, action) => {
      const idsToDelete = action.payload;
      state.measurements = state.measurements.filter(
        (m) => !idsToDelete.includes(m.id)
      );
    },

    // Reset measurements for new order
    resetMeasurements: (state) => {
      state.measurements = [];
    },

    // Import measurements from template
    importFromTemplate: (state, action) => {
      const { templateIds } = action.payload;
      const templatesData = state.templates.filter((t) =>
        templateIds.includes(t.id)
      );

      const newMeasurements = templatesData.map((template) => ({
        id: Date.now().toString() + Math.random(),
        enName: template.enName,
        urName: template.urName,
        category: template.category,
        value: "",
        image: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      state.measurements.push(...newMeasurements);
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  addMeasurement,
  updateMeasurement,
  deleteMeasurement,
  setMeasurements,
  addTemplate,
  updateTemplate,
  deleteTemplate,
  setSelectedCategory,
  addMultipleMeasurements,
  deleteMultipleMeasurements,
  resetMeasurements,
  importFromTemplate,
} = measurementSlice.actions;

// Selectors
export const selectAllMeasurements = (state) => state.measurements.measurements;
export const selectAllTemplates = (state) => state.measurements.templates;
export const selectMeasurementsLoading = (state) => state.measurements.loading;
export const selectMeasurementsError = (state) => state.measurements.error;
export const selectSelectedCategory = (state) =>
  state.measurements.selectedCategory;

export const selectMeasurementsByCategory = (state) => {
  const { measurements, selectedCategory } = state.measurements;
  if (selectedCategory === "all") return measurements;
  return measurements.filter((m) => m.category === selectedCategory);
};

export const selectTemplatesByCategory = (state, category) => {
  const templates = state.measurements.templates;
  if (category === "all") return templates;
  return templates.filter((t) => t.category === category);
};

export const selectMeasurementById = (state, measurementId) =>
  state.measurements.measurements.find((m) => m.id === measurementId);

export const selectTemplateById = (state, templateId) =>
  state.measurements.templates.find((t) => t.id === templateId);

export default measurementSlice.reducer;
