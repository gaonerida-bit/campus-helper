'use client';

import React from 'react';

// 简历数据接口
export interface ResumeData {
  name: string;
  contact: {
    phone: string;
    email: string;
    location?: string;
  };
  education: Array<{
    school: string;
    major: string;
    degree: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    courses?: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    content: string;
    achievements?: string;
  }>;
  projects: Array<{
    name: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
    techStack?: string;
    achievements?: string;
  }>;
  skills: Array<{
    name: string;
    proficiency: string;
  }>;
  honors: Array<{
    name: string;
    level: string;
    date: string;
    description?: string;
  }>;
  selfEvaluation?: string;
}

interface PrintableResumeProps {
  data: ResumeData;
  ref?: React.Ref<HTMLDivElement>;
}

const PrintableResume = React.forwardRef<HTMLDivElement, PrintableResumeProps>(
  ({ data }, ref) => {
    const formatDate = (date: string) => {
      if (!date) return '';
      return date.replace('-', '.');
    };

    return (
      <div
        ref={ref}
        className="bg-white p-8 text-black text-sm font-sans"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '20mm 25mm',
          boxSizing: 'border-box',
        }}
      >
        {/* 头部信息 */}
        <div className="text-center mb-6 border-b border-gray-300 pb-4">
          <h1 className="text-2xl font-bold mb-2">{data.name || '姓名'}</h1>
          <div className="text-gray-600 text-sm flex justify-center gap-4 flex-wrap">
            {data.contact.phone && <span>📱 {data.contact.phone}</span>}
            {data.contact.email && <span>✉️ {data.contact.email}</span>}
            {data.contact.location && <span>📍 {data.contact.location}</span>}
          </div>
        </div>

        {/* 教育经历 */}
        {data.education.length > 0 && (
          <section className="mb-5">
            <h2 className="text-base font-bold border-b border-gray-200 pb-1 mb-3 text-gray-800">
              教育经历
            </h2>
            {data.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold">{edu.school}</span>
                  <span className="text-gray-500 text-xs">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                <div className="text-gray-600 text-xs mt-0.5">
                  {edu.major} {edu.degree && `· ${edu.degree}`}
                  {edu.gpa && ` | GPA: ${edu.gpa}`}
                </div>
                {edu.courses && (
                  <div className="text-gray-500 text-xs mt-0.5">
                    主修课程：{edu.courses}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* 实习经历 */}
        {data.experience.length > 0 && (
          <section className="mb-5">
            <h2 className="text-base font-bold border-b border-gray-200 pb-1 mb-3 text-gray-800">
              实习经历
            </h2>
            {data.experience.map((exp, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold">{exp.company}</span>
                  <span className="text-gray-500 text-xs">
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </span>
                </div>
                <div className="text-gray-600 text-xs mt-0.5">{exp.position}</div>
                {exp.content && (
                  <div className="text-gray-600 text-xs mt-1 whitespace-pre-line leading-relaxed">
                    {exp.content}
                  </div>
                )}
                {exp.achievements && (
                  <div className="text-gray-500 text-xs mt-1">
                    <span className="text-gray-700">• 成就：</span>
                    {exp.achievements}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* 项目经历 */}
        {data.projects.length > 0 && (
          <section className="mb-5">
            <h2 className="text-base font-bold border-b border-gray-200 pb-1 mb-3 text-gray-800">
              项目经历
            </h2>
            {data.projects.map((proj, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold">{proj.name}</span>
                  <span className="text-gray-500 text-xs">
                    {formatDate(proj.startDate)} - {formatDate(proj.endDate)}
                  </span>
                </div>
                <div className="text-gray-600 text-xs mt-0.5">{proj.role}</div>
                {proj.description && (
                  <div className="text-gray-600 text-xs mt-1 whitespace-pre-line leading-relaxed">
                    {proj.description}
                  </div>
                )}
                {proj.techStack && (
                  <div className="text-gray-500 text-xs mt-1">
                    <span className="text-gray-700">技术栈：</span>
                    {proj.techStack}
                  </div>
                )}
                {proj.achievements && (
                  <div className="text-gray-500 text-xs mt-1">
                    <span className="text-gray-700">• 成果：</span>
                    {proj.achievements}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* 专业技能 */}
        {data.skills.length > 0 && (
          <section className="mb-5">
            <h2 className="text-base font-bold border-b border-gray-200 pb-1 mb-3 text-gray-800">
              专业技能
            </h2>
            <div className="text-gray-600 text-xs leading-relaxed">
              {data.skills.map((skill, index) => (
                <span key={index}>
                  {skill.name}
                  {skill.proficiency && `（${skill.proficiency}）`}
                  {index < data.skills.length - 1 ? '、' : ''}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* 荣誉奖项 */}
        {data.honors.length > 0 && (
          <section className="mb-5">
            <h2 className="text-base font-bold border-b border-gray-200 pb-1 mb-3 text-gray-800">
              荣誉奖项
            </h2>
            {data.honors.map((honor, index) => (
              <div key={index} className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">
                  <span className="text-gray-800 font-medium">{honor.name}</span>
                  {honor.level && `（${honor.level}）`}
                  {honor.description && ` - ${honor.description}`}
                </span>
                <span className="text-gray-500">{honor.date}</span>
              </div>
            ))}
          </section>
        )}

        {/* 自我评价 */}
        {data.selfEvaluation && (
          <section className="mb-2">
            <h2 className="text-base font-bold border-b border-gray-200 pb-1 mb-3 text-gray-800">
              自我评价
            </h2>
            <p className="text-gray-600 text-xs leading-relaxed whitespace-pre-line">
              {data.selfEvaluation}
            </p>
          </section>
        )}
      </div>
    );
  }
);

PrintableResume.displayName = 'PrintableResume';

export default PrintableResume;
