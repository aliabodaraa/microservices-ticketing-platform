import axios, { AxiosError, AxiosResponse, Method } from "axios";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, X, RefreshCw } from "lucide-react";

interface UseRequestProps {
  url: string;
  method: Method;
  body?: any;
  onSuccess?: (data: any) => void;
}

interface ErrorType {
  message: string;
  field?: string;
}

interface ApiError {
  errors?: ErrorType[];
  message?: string;
}

const constructUrlWithQueryParams = (
  url: string,
  params: Record<string, any>
): string => {
  const searchParams = new URLSearchParams();

  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      searchParams.append(key, params[key]);
    }
  });

  const paramsStr = searchParams.toString();
  return paramsStr ? `${url}?${paramsStr}` : url;
};

const useRequest = ({ url, method, body, onSuccess }: UseRequestProps) => {
  const [errors, setErrors] = useState<React.ReactNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const doRequest = async (
    options: {
      props?: Record<string, any>;
      params?: Record<string, any>;
    } = {}
  ): Promise<any> => {
    const { props = {}, params = {} } = options;
    const modifiedUrl = constructUrlWithQueryParams(url, params);

    try {
      setIsLoading(true);
      setErrors(null);

      const response: AxiosResponse = await axios({
        method,
        url: modifiedUrl,
        data: { ...body, ...props },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiError>;
      console.error("Request failed:", axiosError?.response?.data);

      let errorContent: React.ReactNode;

      if (axiosError.response?.data?.errors) {
        errorContent = (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Validation Error</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 list-disc list-inside space-y-1">
                {axiosError.response.data.errors.map(
                  (error: ErrorType, index: number) => (
                    <li key={index} className="text-sm">
                      {error.message}
                    </li>
                  )
                )}
              </ul>
            </AlertDescription>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={() => setErrors(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Alert>
        );
      } else if (axiosError.response?.data?.message) {
        errorContent = (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {axiosError.response.data.message}
            </AlertDescription>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={() => setErrors(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Alert>
        );
      } else {
        errorContent = (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unexpected Error</AlertTitle>
            <AlertDescription>
              An unexpected error occurred. Please try again.
            </AlertDescription>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={() => setErrors(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Alert>
        );
      }

      setErrors(errorContent);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearErrors = () => {
    setErrors(null);
  };

  const retryRequest = async (options?: {
    props?: Record<string, any>;
    params?: Record<string, any>;
  }) => {
    return await doRequest(options);
  };

  return {
    doRequest,
    errors,
    isLoading,
    clearErrors,
    retryRequest,
  };
};

export default useRequest;
