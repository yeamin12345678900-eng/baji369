
import React from 'react';

const SocialLogins: React.FC = () => {
  return (
    <div className="flex justify-center gap-4">
      <button className="w-14 h-14 rounded-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
        <img 
          alt="Google" 
          className="w-6 h-6" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCbOOfA92XEuyXgptzGfUUrbzpHMz_LR-F5uMGRXrhtDMDMqUV5nbV-rpIIaS1zJws1ux8HwWR8lqsVBS-bvhaaZRclvGCNbOKfmjCaTfGn2CC0MxS_6UZJG6QtlGYTPhsOt6bACErwI5ief2Jw3pZGDzzUS4lOEdH9E35xET38TCkCu_t6nu1-suhPIZW5MbIvxf1T7FgfC_gY8lOfmYDXZs-0-dJmGS6CQQpHV1o3eaW2sLFGCxeXvLgqmh0EmAsPPN0feVg"
        />
      </button>
      <button className="w-14 h-14 rounded-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
        <img 
          alt="Apple" 
          className="w-6 h-6 dark:invert" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5tTx7ab8kPORpQrDm8HZGua8MLGNQBTV3R_1VpsaWeRu_f4wY5OsRY_-fqdZ1oqvzABWB7Zdg7SBaixtcxMerZUSIiiT_0GbRVzitywKT8esQq6W2f4ZNFbK8MJcN2za43rXKgMOZIMG4Mc2xfWQ3dK-sJggUKZuOGGpaJGrbQdMYxLhVB09iJXH93PUUVOloLPQauDN3w7kH9OWozLYcNcz2ZmGA-PWIBFxw37Wh3Y3OYqR-kAH7eT2wx9g-D70cuNZuUZuZ"
        />
      </button>
    </div>
  );
};

export default SocialLogins;
