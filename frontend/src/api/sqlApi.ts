import axiosConfig from '@/lib/axiosConfig';
import type { ISqlCodePayload } from '@/types/sql';

const sqlApi = {
  getCodeID: async (codeId: string) => {
    const response = await axiosConfig.get(`sql/codeid?CodeID=${codeId}`);
    return response.data;
  },
  getColumns: async (payload: ISqlCodePayload) => {
    const response = await axiosConfig.post('sql/columns', payload);
    return response.data;
  },
  executeSQLCode: async (
    payload: ISqlCodePayload
  ): Promise<{ data: any; columns: any; rowsAffected: number }> => {
    // console.log(payload);
    const res = await axiosConfig.post('sql/connect-and-query', payload);
    return res.data;
  },
};

export default sqlApi;
