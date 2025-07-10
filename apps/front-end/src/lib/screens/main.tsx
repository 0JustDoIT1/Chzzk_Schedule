import Image from "next/image";

const MainView = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] p-6 text-center text-white bg-brand-gradient">
      <Image
        src="/assets/images/logo-eng.png"
        alt="0's Life 로고"
        width={400}
        height={120}
        className="mb-6 drop-shadow-xl animate-fadeInUp w-[220px] md:w-[400px] h-auto"
        priority
      />
      <h2 className="mb-8 tracking-wide animate-fadeInUp delay-[100ms] text-2xl md:text-3xl">
        치지직 방송 스케줄러
      </h2>
      <div className="max-w-3xl bg-white bg-opacity-25 backdrop-blur-lg rounded-xl p-8 shadow-2xl animate-fadeInUp delay-[200ms]">
        0's Life는 치지직 스트리머들의 방송일정을 한눈에 모아보는
        웹사이트입니다. 누구나 방송일정을 만들고 수정하고 공유할 수 있으니, 많은
        참여 부탁드립니다.
      </div>
    </main>
  );
};

export default MainView;
