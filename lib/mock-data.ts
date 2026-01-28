import type { HobbyClass, TimeSlot, Reservation } from "@/types/domain.types";

export const mockClasses: HobbyClass[] = [
  {
    id: "1",
    name: "프랑스 가정식 요리 클래스",
    description:
      "프랑스 가정에서 즐기는 따뜻한 요리를 배워보세요. 크로크무슈, 라따뚜이 등 정통 프랑스 요리를 직접 만들어봅니다.",
    price: 65000,
    duration: 120,
    category: "요리",
    studio: {
      id: "s1",
      name: "르 쿠진 스튜디오",
      location: "서울 강남",
      description:
        "프랑스 출신 셰프가 운영하는 요리 스튜디오입니다. 10년 이상의 경력을 바탕으로 진정한 프랑스 요리를 알려드립니다.",
    },
  },
  {
    id: "2",
    name: "도자기 핸드빌딩 원데이",
    description:
      "손으로 직접 빚어 만드는 도자기 클래스입니다. 나만의 머그컵이나 화병을 만들어보세요.",
    price: 55000,
    duration: 180,
    category: "공예",
    studio: {
      id: "s2",
      name: "흙과 불 공방",
      location: "서울 성수",
      description:
        "전통 도자기 기법을 현대적으로 재해석한 공방입니다. 초보자도 쉽게 배울 수 있습니다.",
    },
  },
  {
    id: "3",
    name: "수채화 풍경 드로잉",
    description:
      "수채화의 기본부터 풍경화까지 배워봅니다. 물의 흐름을 이용한 아름다운 표현법을 익혀보세요.",
    price: 45000,
    duration: 150,
    category: "미술",
    studio: {
      id: "s3",
      name: "아트플로우 스튜디오",
      location: "서울 홍대",
      description:
        "현직 아티스트들이 운영하는 미술 스튜디오입니다. 다양한 미술 클래스를 제공합니다.",
    },
  },
  {
    id: "4",
    name: "어쿠스틱 기타 입문",
    description:
      "기타를 처음 접하는 분들을 위한 입문 클래스입니다. 기본 코드부터 간단한 곡 연주까지 배워봅니다.",
    price: 40000,
    duration: 90,
    category: "음악",
    studio: {
      id: "s4",
      name: "사운드웨이브 뮤직",
      location: "서울 홍대",
      description:
        "현직 뮤지션들이 운영하는 음악 스튜디오입니다. 다양한 악기 클래스를 제공합니다.",
    },
  },
  {
    id: "5",
    name: "필라테스 기초반",
    description:
      "코어 강화와 유연성 향상을 위한 필라테스 기초 클래스입니다. 올바른 자세와 호흡법을 배워봅니다.",
    price: 35000,
    duration: 60,
    category: "운동",
    studio: {
      id: "s5",
      name: "바디밸런스 스튜디오",
      location: "서울 강남",
      description:
        "전문 강사진이 운영하는 필라테스 스튜디오입니다. 소수 정예로 진행됩니다.",
    },
  },
  {
    id: "6",
    name: "DSLR 사진 기초",
    description:
      "DSLR 카메라의 기본 조작법부터 구도까지 배워봅니다. 야외 촬영 실습도 함께 진행합니다.",
    price: 60000,
    duration: 180,
    category: "사진",
    studio: {
      id: "s6",
      name: "렌즈스토리",
      location: "서울 성수",
      description:
        "프로 사진작가가 운영하는 사진 스튜디오입니다. 다양한 사진 클래스를 제공합니다.",
    },
  },
  {
    id: "7",
    name: "K-POP 댄스 클래스",
    description:
      "인기 K-POP 안무를 배워봅니다. 처음이셔도 걱정 마세요! 기초부터 차근차근 알려드립니다.",
    price: 30000,
    duration: 90,
    category: "댄스",
    studio: {
      id: "s7",
      name: "댄스팩토리",
      location: "서울 홍대",
      description:
        "현직 댄서들이 운영하는 댄스 스튜디오입니다. 다양한 장르의 댄스 클래스를 제공합니다.",
    },
  },
  {
    id: "8",
    name: "이탈리안 파스타 마스터",
    description:
      "정통 이탈리안 파스타를 직접 만들어봅니다. 면 반죽부터 소스까지 전 과정을 배워봅니다.",
    price: 70000,
    duration: 150,
    category: "요리",
    studio: {
      id: "s8",
      name: "파스타 아틀리에",
      location: "서울 잠실",
      description:
        "이탈리아에서 수련한 셰프가 운영하는 요리 스튜디오입니다.",
    },
  },
];

export const mockTimeSlots: TimeSlot[] = [
  {
    id: "ts1",
    classId: "1",
    date: "2026-02-01",
    startTime: "10:00",
    maxCapacity: 8,
    currentBookings: 3,
  },
  {
    id: "ts2",
    classId: "1",
    date: "2026-02-01",
    startTime: "14:00",
    maxCapacity: 8,
    currentBookings: 8,
  },
  {
    id: "ts3",
    classId: "1",
    date: "2026-02-02",
    startTime: "10:00",
    maxCapacity: 8,
    currentBookings: 5,
  },
  {
    id: "ts4",
    classId: "2",
    date: "2026-02-01",
    startTime: "13:00",
    maxCapacity: 6,
    currentBookings: 2,
  },
  {
    id: "ts5",
    classId: "2",
    date: "2026-02-03",
    startTime: "15:00",
    maxCapacity: 6,
    currentBookings: 6,
  },
  {
    id: "ts6",
    classId: "3",
    date: "2026-02-02",
    startTime: "11:00",
    maxCapacity: 10,
    currentBookings: 4,
  },
  {
    id: "ts7",
    classId: "4",
    date: "2026-02-01",
    startTime: "19:00",
    maxCapacity: 4,
    currentBookings: 1,
  },
  {
    id: "ts8",
    classId: "5",
    date: "2026-02-02",
    startTime: "09:00",
    maxCapacity: 8,
    currentBookings: 7,
  },
];

export const mockReservations: Reservation[] = [
  {
    id: "r1",
    classId: "1",
    className: "프랑스 가정식 요리 클래스",
    timeSlotId: "ts1",
    date: "2026-02-01",
    startTime: "10:00",
    guests: 2,
    status: "CONFIRMED",
    studioName: "르 쿠진 스튜디오",
    createdAt: "2026-01-20T09:00:00Z",
  },
  {
    id: "r2",
    classId: "3",
    className: "수채화 풍경 드로잉",
    timeSlotId: "ts6",
    date: "2026-02-02",
    startTime: "11:00",
    guests: 1,
    status: "PENDING",
    studioName: "아트플로우 스튜디오",
    createdAt: "2026-01-22T14:30:00Z",
  },
  {
    id: "r3",
    classId: "7",
    className: "K-POP 댄스 클래스",
    timeSlotId: "ts7",
    date: "2026-02-05",
    startTime: "19:00",
    guests: 3,
    status: "CONFIRMED",
    studioName: "댄스팩토리",
    createdAt: "2026-01-25T11:00:00Z",
  },
];
