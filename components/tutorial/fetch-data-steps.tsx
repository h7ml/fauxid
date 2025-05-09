import { TutorialStep } from "./tutorial-step";
import { CodeBlock } from "./code-block";

const create = `create table notes (
  id bigserial primary key,
  title text
);

insert into notes(title)
values
  ('今天我创建了一个Supabase项目。'),
  ('我添加了一些数据并从Next.js中查询了它。'),
  ('太棒了！');
`.trim();

const server = `import { createClient } from '@/utils/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: notes } = await supabase.from('notes').select()

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
`.trim();

const client = `'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export default function Page() {
  const [notes, setNotes] = useState<any[] | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from('notes').select()
      setNotes(data)
    }
    getData()
  }, [])

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
`.trim();

export default function FetchDataSteps() {
  return (
    <ol className="flex flex-col gap-6">
      <TutorialStep title="创建表格并插入一些数据">
        <p>
          前往您Supabase项目的{" "}
          <a
            href="https://supabase.com/dashboard/project/_/editor"
            className="font-bold hover:underline text-foreground/80"
            target="_blank"
            rel="noreferrer"
          >
            表格编辑器
          </a>{" "}
          创建一个表并插入一些示例数据。如果您不知道从何处开始，可以复制以下内容到{" "}
          <a
            href="https://supabase.com/dashboard/project/_/sql/new"
            className="font-bold hover:underline text-foreground/80"
            target="_blank"
            rel="noreferrer"
          >
            SQL编辑器
          </a>{" "}
          中并点击运行！
        </p>
        <CodeBlock code={create} />
      </TutorialStep>

      <TutorialStep title="从Next.js查询Supabase数据">
        <p>
          要创建Supabase客户端并从异步服务器组件查询数据，请在{" "}
          <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
            /app/notes/page.tsx
          </span>{" "}
          创建一个新的page.tsx文件并添加以下内容。
        </p>
        <CodeBlock code={server} />
        <p>或者，您也可以使用客户端组件。</p>
        <CodeBlock code={client} />
      </TutorialStep>

      <TutorialStep title="周末构建，面向百万用户！">
        <p>您已准备好向全世界推出您的产品！🚀</p>
      </TutorialStep>
    </ol>
  );
}
