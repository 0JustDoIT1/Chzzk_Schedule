import { IApiError } from "../types/error-response";
import { TToastType } from "../types/toastType";

// schedule-error-handler
export const handleScheduleApiError = (
  error: IApiError,
  showToast: (type: TToastType, message: string) => void
) => {
  if (error.status === 409) {
    showToast("error", "같은 시간대에 스케줄이 존재합니다.");
  } else if (error.status === 400) {
    showToast("error", "입력값을 다시 확인해주세요.");
  } else {
    showToast("error", "알 수 없는 오류가 발생했습니다.");
  }
};
