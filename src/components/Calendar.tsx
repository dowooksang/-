'use client';

import { useState, useEffect } from 'react';

// 요일 이름 정의
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// 날짜별 임시 일정 생성 함수
const getEventForDate = (date: Date) => {
  const dayOfWeek = date.getDay(); // 0: 일, 6: 토
  const dayOfMonth = date.getDate();

  // 매월 15일 고정 일정
  if (dayOfMonth === 15) {
    return {
      title: '전국 지부장 정기 연합 회의',
      time: '19:00',
      location: '연합회 본부 회의실 (온라인 병행)',
    };
  }

  // 매주 토요일 일정
  if (dayOfWeek === 6) {
    return {
      title: '전국 지부 연합 버스킹 & 정기 합주',
      time: '15:00',
      location: '홍대 롤링홀 & 지부별 지정 연습실',
    };
  }

  // 매주 일요일 일정
  if (dayOfWeek === 0) {
    return {
      title: '신입 회원 오리엔테이션 및 친목 잼',
      time: '14:00',
      location: '지부별 연습 공간',
    };
  }

  // 매월 25일 일정
  if (dayOfMonth === 25) {
    return {
      title: '이달의 우수 밴드 영상 심사 및 발표',
      time: '18:00',
      location: '공식 홈페이지 공지사항',
    };
  }

  // 평일 기본 안내
  return {
    title: '지부별 개인 연습 및 소규모 밴드 세션',
    time: '상시 운영',
    location: '지부별 대여 연습실',
  };
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Hydration mismatch 방지를 위해 클라이언트 측에서만 날짜를 초기화합니다.
  useEffect(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  }, []);

  if (!currentDate || !selectedDate) {
    return (
      <div className="bg-[#111827]/90 border border-white/10 rounded-xl p-6 shadow-xl flex-1 flex items-center justify-center min-h-[350px]">
        <div className="animate-pulse text-gray-400">달력을 불러오는 중...</div>
      </div>
    );
  }

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // 이전 달로 이동
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // 다음 달로 이동
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // 현재 월의 첫 번째 날짜와 요일
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startDayOfWeek = firstDayOfMonth.getDay();

  // 현재 월의 마지막 날짜 (총 일수)
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // 캘린더 날짜 배열 생성
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // 오늘 날짜 여부 확인
  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  // 선택된 날짜 여부 확인
  const isSelected = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  // 날짜 선택 이벤트
  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));
  };

  const currentEvent = getEventForDate(selectedDate);
  const selectedDayOfWeek = WEEKDAYS[selectedDate.getDay()];

  return (
    <div className="bg-[#111827]/90 border border-white/10 rounded-xl p-6 shadow-xl flex-1 flex flex-col transition-all duration-300 hover:border-accent/40">
      {/* 캘린더 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePrevMonth}
          className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
          aria-label="이전 달"
        >
          &lt;
        </button>
        <span className="text-xl font-bold tracking-wider">
          {currentYear}. {String(currentMonth + 1).padStart(2, '0')}
        </span>
        <button
          onClick={handleNextMonth}
          className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
          aria-label="다음 달"
        >
          &gt;
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-4 text-gray-400 font-bold border-b border-white/5 pb-2">
        {WEEKDAYS.map((day, idx) => (
          <span
            key={day}
            className={
              idx === 0 ? 'text-red-400' : idx === 6 ? 'text-blue-400' : 'text-gray-400'
            }
          >
            {day}
          </span>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
        {/* 1일 시작 요일 전까지 빈 칸 생성 */}
        {Array.from({ length: startDayOfWeek }).map((_, idx) => (
          <div key={`empty-${idx}`} className="py-2" />
        ))}

        {/* 날짜 목록 */}
        {days.map((day) => {
          const isDayToday = isToday(day);
          const isDaySelected = isSelected(day);

          return (
            <button
              key={`day-${day}`}
              onClick={() => handleDateClick(day)}
              className={`py-2 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center w-8 h-8 mx-auto hover:bg-white/10 ${
                isDaySelected
                  ? 'bg-accent text-[#0A103D] font-bold shadow-[0_0_12px_rgba(130,200,255,0.6)]'
                  : isDayToday
                  ? 'bg-white/20 text-white font-bold border border-white/40'
                  : 'text-gray-300'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* 선택된 날짜의 일정 상세 */}
      <div className="mt-8 pt-6 border-t border-white/10 transition-all duration-300 animate-[fadeIn_0.3s_ease-out]">
        <p className="text-sm text-accent font-bold mb-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          {String(selectedDate.getMonth() + 1).padStart(2, '0')}.
          {String(selectedDate.getDate()).padStart(2, '0')} ({selectedDayOfWeek})
        </p>
        <h4 className="text-base text-white font-semibold transition-colors duration-300">
          {currentEvent.title}
        </h4>
        <div className="flex flex-col gap-0.5 mt-2 text-xs text-gray-400">
          <span>🕒 시간: {currentEvent.time}</span>
          <span>📍 장소: {currentEvent.location}</span>
        </div>
      </div>
    </div>
  );
}
