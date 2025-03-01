"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// 폼 스키마 정의
const formSchema = z.object({
  name: z.string().min(2, { message: "이름은 2자 이상이어야 합니다." }),
  email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
  phone: z.string().min(10, { message: "유효한 전화번호를 입력해주세요." }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "성별을 선택해주세요.",
  }),
  age: z.string({ required_error: "연령대를 선택해주세요." }),
});

export type UserFormData = z.infer<typeof formSchema>;

type UserFormDialog2Props = {
  onSubmit: (values: UserFormData | null, action: "submit" | "cancel") => void;
};

export function UserFormDialog2({ onSubmit }: UserFormDialog2Props) {
  const [open, setOpen] = React.useState(true);
  const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [errorField, setErrorField] = React.useState<string | null>(null);
  
  // 폼 초기화
  const form = useForm<UserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
    mode: "onSubmit",
  });

  // 필드 포커스를 처리하는 공통 함수
  const focusField = (fieldName: string) => {
    setTimeout(() => {
      // 필드 이름에 해당하는 입력 요소 찾기
      const inputElement = document.querySelector(`input[name="${fieldName}"], 
                                                  [role="radiogroup"][id="${fieldName}"], 
                                                  [id="${fieldName}"]`);
      
      if (inputElement) {
        // 요소가 존재하면 해당 요소로 스크롤 및 포커스
        (inputElement as HTMLElement).scrollIntoView({ 
          behavior: "smooth", 
          block: "center" 
        });
        
        // 입력 필드의 경우 포커스도 설정
        if ('focus' in inputElement) {
          (inputElement as HTMLElement).focus();
        }
      }
    }, 0);
  };

  // 폼 제출 처리
  function handleSubmit(values: UserFormData) {
    console.log("제출된 데이터:", values);
    onSubmit(values, "submit");
    setOpen(false);
  }

  // 취소 처리
  function handleCancel() {
    console.log("사용자가 취소함");
    onSubmit(null, "cancel");
    setOpen(false);
  }

  // 다이얼로그 닫기 처리
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      onSubmit(null, "cancel");
    }
  };

  // 에러 다이얼로그 닫기 처리
  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
    
    // 에러 필드로 포커스 이동
    if (errorField) {
      focusField(errorField);
    }
  };

  // 에러가 있을 때 실행되는 함수
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (errors: any) => {
    // 첫 번째 에러 메시지 가져오기
    const fieldNames = Object.keys(errors);
    if (fieldNames.length > 0) {
      const firstField = fieldNames[0];
      const errorMsg = errors[firstField].message;
      
      setErrorMessage(errorMsg);
      setErrorField(firstField);
      setErrorDialogOpen(true);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogOverlay className="bg-black/1" />
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle>사용자 정보 입력</DialogTitle>
            <DialogDescription>
              서비스 이용을 위해 아래 정보를 입력해주세요. 모든 정보는 안전하게
              보호됩니다.
            </DialogDescription>
          </DialogHeader>

          {/* 구분선 추가 */}
          <Separator className="my-2" />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit, onError)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="min-w-[80px] text-right mb-0">이름</FormLabel>
                    <FormControl className="flex-1">
                      <Input placeholder="홍길동" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="min-w-[80px] text-right mb-0">이메일</FormLabel>
                    <FormControl className="flex-1">
                      <Input placeholder="example@email.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="min-w-[80px] text-right mb-0">전화번호</FormLabel>
                    <FormControl className="flex-1">
                      <Input placeholder="01012345678" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="min-w-[80px] text-right mb-0">성별</FormLabel>
                    <FormControl>
                      <RadioGroup
                        id="gender"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="font-normal">남성</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal">여성</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="other" />
                          </FormControl>
                          <FormLabel className="font-normal">기타</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="min-w-[80px] text-right mb-0">연령대</FormLabel>
                    <FormControl className="flex-1">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="연령대를 선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10s">10대</SelectItem>
                          <SelectItem value="20s">20대</SelectItem>
                          <SelectItem value="30s">30대</SelectItem>
                          <SelectItem value="40s">40대</SelectItem>
                          <SelectItem value="50s">50대</SelectItem>
                          <SelectItem value="60s">60대 이상</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  취소
                </Button>
                <Button type="submit">저장</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* 에러 메시지 다이얼로그 */}
      <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              입력 오류
            </AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleErrorDialogClose}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}