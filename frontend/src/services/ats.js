import api from "./api";

export const getATSScore = async (
  resumeId,
  jobId
) => {
  const response = await api.get(
    `/resumes/${resumeId}/ats/?job=${jobId}`
  );

  return response.data;
};