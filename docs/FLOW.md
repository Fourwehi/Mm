1. 사용자 여정 및 로직 흐름 (Sequence Diagram)

사용자가 웹사이트에 접속하여 클래스를 탐색하고, 상세 내용을 확인한 뒤, AI 요약을 참고하여 예약을 확정하는 과정을 나타냅니다.

sequenceDiagram
    autonumber
    actor User as 사용자
    participant Client as Frontend (Next.js)
    participant Server as Mock DB / API
    participant AI as AI Service

    note over User, Client: 1. 클래스 탐색 (Discovery)
    User->>Client: 메인 페이지 접속 (/)
    Client->>Server: 클래스 목록 요청 (지역/카테고리 필터)
    Server-->>Client: 클래스 데이터 반환
    Client-->>User: 클래스 카드 리스트 표시

    note over User, Client: 2. 클래스 상세 (Detail)
    User->>Client: 클래스 클릭 (상세 진입)
    Client->>Server: 클래스 상세 정보 & 스튜디오 정보 요청
    Server-->>Client: 상세 데이터 반환
    Client->>AI: 클래스 설명 텍스트 전달
    AI-->>Client: AI 요약 텍스트 생성 (Phase 1)
    Client-->>User: 상세 정보 및 AI 요약 표시

    note over User, Client: 3. 예약 진행 (Booking)
    User->>Client: '예약하기' 버튼 클릭
    Client->>Server: 해당 클래스의 회차(TimeSlot) 목록 요청
    Server-->>Client: 날짜별 회차 및 잔여석 정보 반환
    Client-->>User: 날짜/시간 선택 UI 표시
    
    User->>Client: 회차 선택 및 인원 수 설정
    Client->>Client: 예약 가능 여부 확인 (잔여석 >= 인원)
    
    User->>Client: 예약 확정 요청
    Client->>Server: 예약 데이터 생성 (Reservation)
    Server->>Server: 회차(TimeSlot) 잔여석 차감
    Server-->>Client: 예약 완료 응답 (Status: CONFIRMED)
    
    note over User, Client: 4. 예약 확인
    Client-->>User: 예약 성공 화면 표시
    User->>Client: '내 예약' 페이지 이동 (/reservations)
    Client->>Server: 내 예약 목록 요청
    Server-->>Client: 예약 리스트 반환
    Client-->>User: 예약 내역 표시


2. 서비스 아키텍처 및 페이지 구조 (Flowchart)

Next.js의 App Router 구조를 기반으로 한 페이지 흐름과 주요 컴포넌트 간의 관계를 나타냅니다.

flowchart TD
    subgraph Client [Client Side (Browser)]
        Start((접속)) --> Main[/메인 페이지<br>app/page.tsx/]
        
        %% Header Navigation
        Nav{네비게이션}
        Main --- Nav
        Nav -->|탐색| Main
        Nav -->|내 예약| MyRes[/내 예약<br>app/reservations/]
        Nav -->|관리자| Admin[/관리자 대시보드<br>app/admin/]
        
        %% Main Page Components
        Main --> Filter[필터 컴포넌트<br>ClassFilter]
        Main --> List[리스트 컴포넌트<br>ClassList]
        List --> Card[클래스 카드<br>ClassCard]
        
        %% Detail Flow
        Card -->|클릭| Detail[/상세 페이지<br>app/class/:id/]
        
        Detail --> DetailContent[상세 정보<br>ClassDetailContent]
        DetailContent --> AIBox[AI 요약 영역]
        DetailContent --> StudioInfo[스튜디오 정보]
        
        %% Booking Flow
        Detail -->|예약하기 버튼| Booking[/예약 페이지<br>app/class/:id/book/]
        Booking --> BookingContent[예약 로직<br>BookingContent]
        BookingContent --> TimeSlot[회차 선택]
        BookingContent --> Guest[인원 선택]
        
        %% Logic
        Guest --> Confirm{예약 확정?}
        Confirm -->|Yes| Success[성공 화면]
        Success -->|확인| MyRes
        
        %% Admin Flow
        Admin --> AdminDash[관리자 대시보드<br>AdminDashboard]
        AdminDash --> Tab1[클래스 관리]
        AdminDash --> Tab2[회차 관리]
        AdminDash --> Tab3[예약 현황]
    end

    subgraph Data [Data Layer (lib/mock-data)]
        DB[(Mock Data)]
        Main -.-> DB
        Detail -.-> DB
        Booking -.-> DB
        MyRes -.-> DB
        Admin -.-> DB
    end

